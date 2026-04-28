/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
// import 'vuetify/styles';
import { pt, en } from 'vuetify/locale';
// Composables
import { createVuetify } from 'vuetify';
import { vuetifyColors } from '../../theme';
import type { VAlert, VTextarea, VSelect, VAutocomplete, VTextField, VBanner, VBtn, VLabel } from 'vuetify/lib/components/index.mjs';
import { VFileUpload } from 'vuetify/labs/VFileUpload'

import 'vuetify/styles';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    defaults: {
        VTextField: {
            hideDetails: 'auto',
            variant: 'outlined',
            bgColor: 'transparent',
            density: 'comfortable',
        } as VTextField['$props'],
        VAutocomplete: {
            density: 'comfortable',
            hideDetails: 'auto',
            variant: 'outlined',
            bgColor: 'transparent',
        } as VAutocomplete['$props'],
        VSelect: {
            density: 'comfortable',
            hideDetails: 'auto',
            variant: 'outlined',
            bgColor: 'transparent',
        } as VSelect['$props'],
        VFileInput: {
            density: 'comfortable',
            hideDetails: 'auto',
            variant: 'outlined',
            bgColor: 'transparent',
        },
        VTextarea: {
            density: 'comfortable',
            hideDetails: 'auto',
            variant: 'outlined',
            bgColor: 'transparent',
        } as VTextarea['$props'],

        VBtn: {
            elevation: 0,
        } as VBtn['$props'],
        VLabel: {
            class: 'tw-opacity-100'
        } as VLabel['$props'],
        VFileUpload: {
        } as VFileUpload['$props'],
    },
    locale: {
        locale: 'pt',
        fallback: 'en',
        messages: { pt, en },
    },
    display: {
        mobileBreakpoint: 'sm',
        thresholds: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
        },
    },
    theme: {
        themes: {
            light: {
                colors: vuetifyColors(),
            },
        },
    },
    components: {
        VFileUpload,
    },
});
