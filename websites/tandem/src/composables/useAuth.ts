import { computed, ref, shallowRef } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import type { Household, HouseholdGoal, Profile } from '@/types/supabase'
import { isSupabaseConfigured, requireSupabase } from '@/lib/supabase'

const session = shallowRef<Session | null>(null)
const profile = shallowRef<Profile | null>(null)
const household = shallowRef<Household | null>(null)
const householdGoals = shallowRef<HouseholdGoal[]>([])
const partnerProfiles = shallowRef<Profile[]>([])
const ready = ref(false)
const authError = ref<string | null>(null)

async function loadContext(userId: string) {
  const sb = requireSupabase()

  const { data: me, error: profileError } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) throw profileError
  profile.value = me as Profile

  if (!me.household_id) {
    household.value = null
    householdGoals.value = []
    partnerProfiles.value = []
    return
  }

  const [
    { data: home, error: homeError },
    { data: members, error: membersError },
    { data: goals, error: goalsError },
  ] = await Promise.all([
    sb.from('households').select('*').eq('id', me.household_id).single(),
    sb.from('profiles').select('*').eq('household_id', me.household_id),
    sb.from('household_goals').select('*').eq('household_id', me.household_id).order('sort_order'),
  ])

  if (homeError) throw homeError
  if (membersError) throw membersError
  if (goalsError && goalsError.code !== 'PGRST205' && goalsError.code !== '42P01') {
    throw goalsError
  }

  household.value = home as Household
  partnerProfiles.value = (members ?? []) as Profile[]
  householdGoals.value = (goals ?? []) as HouseholdGoal[]
}

export function useAuth() {
  const user = computed<User | null>(() => session.value?.user ?? null)
  const hasHousehold = computed(() => Boolean(profile.value?.household_id))
  const householdMembers = computed(() => partnerProfiles.value)

  const displayName = computed(() => {
    const name = profile.value?.display_name?.trim()
    if (name) return name
    const email = user.value?.email
    return email ? email.split('@')[0] : 'Utilizador'
  })

  const houseLabel = computed(() => household.value?.name?.trim() || 'Sem casa')

  async function init() {
    authError.value = null
    if (!isSupabaseConfigured) {
      ready.value = true
      return
    }

    const sb = requireSupabase()
    const { data } = await sb.auth.getSession()
    session.value = data.session

    if (data.session?.user) {
      try {
        await loadContext(data.session.user.id)
      } catch {
        authError.value = 'Não foi possível carregar o perfil.'
      }
    }

    sb.auth.onAuthStateChange(async (_event, nextSession) => {
      session.value = nextSession
      if (nextSession?.user) {
        try {
          await loadContext(nextSession.user.id)
        } catch {
          authError.value = 'Não foi possível carregar o perfil.'
        }
      } else {
        profile.value = null
        household.value = null
        householdGoals.value = []
        partnerProfiles.value = []
      }
    })

    ready.value = true
  }

  async function signInWithPassword(email: string, password: string) {
    authError.value = null
    const { error } = await requireSupabase().auth.signInWithPassword({ email, password })
    if (error) authError.value = error.message
    return !error
  }

  async function signUp(email: string, password: string, displayName: string) {
    authError.value = null
    const { error } = await requireSupabase().auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) authError.value = error.message
    return !error
  }

  async function signOut() {
    const sb = requireSupabase()
    await sb.auth.signOut()
    session.value = null
    profile.value = null
    household.value = null
    householdGoals.value = []
    partnerProfiles.value = []
  }

  async function refreshContext() {
    if (!user.value) return
    await loadContext(user.value.id)
  }

  async function updateProfile(patch: { display_name?: string; avatar_url?: string | null }) {
    if (!user.value) return
    const { error } = await requireSupabase()
      .from('profiles')
      .update(patch)
      .eq('id', user.value.id)
    if (error) throw error
    await refreshContext()
  }

  async function updateHousehold(patch: { name?: string; avatar_url?: string | null }) {
    if (!household.value) return
    const { error } = await requireSupabase()
      .from('households')
      .update(patch)
      .eq('id', household.value.id)
    if (error) throw error
    await refreshContext()
  }

  async function addHouseholdGoal(
    goal: Pick<HouseholdGoal, 'kind' | 'title' | 'target_amount' | 'target_date' | 'notes'>,
  ) {
    if (!household.value) return
    const { error } = await requireSupabase().from('household_goals').insert({
      household_id: household.value.id,
      kind: goal.kind,
      title: goal.title,
      target_amount: goal.target_amount,
      target_date: goal.target_date,
      notes: goal.notes,
      sort_order: householdGoals.value.length,
    })
    if (error) throw error
    await refreshContext()
  }

  async function deleteHouseholdGoal(id: string) {
    const { error } = await requireSupabase().from('household_goals').delete().eq('id', id)
    if (error) throw error
    await refreshContext()
  }

  async function createHousehold(name: string) {
    const { error } = await requireSupabase().rpc('create_household', {
      household_name: name,
    })
    if (error) throw error
    await refreshContext()
  }

  async function joinHousehold(code: string) {
    const { error } = await requireSupabase().rpc('join_household', { code })
    if (error) throw error
    await refreshContext()
  }

  return {
    session,
    user,
    profile,
    household,
    householdGoals,
    householdMembers,
    hasHousehold,
    displayName,
    houseLabel,
    ready,
    authError,
    isSupabaseConfigured,
    init,
    signInWithPassword,
    signUp,
    signOut,
    createHousehold,
    joinHousehold,
    refreshContext,
    updateProfile,
    updateHousehold,
    addHouseholdGoal,
    deleteHouseholdGoal,
  }
}
