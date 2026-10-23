import { nextTick, onBeforeUnmount, onMounted } from 'vue';

export function useReveal(getRoot?: () => ParentNode | null | undefined) {
    let observer: IntersectionObserver | undefined;
    const seen = new WeakSet<Element>();

    const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function jaEstaNoEcra(node: Element) {
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;

        const altura = window.innerHeight || document.documentElement.clientHeight;
        const largura = window.innerWidth || document.documentElement.clientWidth;
        const visivelNaVertical = Math.min(rect.bottom, altura) - Math.max(rect.top, 0);
        const visivelNaHorizontal = Math.min(rect.right, largura) - Math.max(rect.left, 0);

        return visivelNaHorizontal > 0 && visivelNaVertical >= rect.height * 0.05;
    }

    function scan() {
        const scope = getRoot?.() ?? document;

        scope.querySelectorAll('.reveal:not(.is-visible)').forEach((node) => {
            if (reduceMotion() || jaEstaNoEcra(node)) {
                node.classList.add('is-visible');
                return;
            }

            if (seen.has(node) || !observer) return;

            seen.add(node);
            observer.observe(node);
        });
    }

    onMounted(() => {
        if (!reduceMotion()) {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;
                        entry.target.classList.add('is-visible');
                        observer?.unobserve(entry.target);
                    });
                },
                { threshold: 0.05, rootMargin: '0px 0px 12% 0px' },
            );
        }

        nextTick(scan);
    });

    onBeforeUnmount(() => observer?.disconnect());

    return { refresh: () => nextTick(scan) };
}
