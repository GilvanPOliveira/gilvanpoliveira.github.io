import type { Directive, DirectiveBinding } from 'vue';

interface RevealOptions {
  delay?: number; 
}

const scrollReveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el, binding: DirectiveBinding<RevealOptions | undefined>) {
    const delay = binding.value?.delay ?? 0;

    el.classList.add(
      'opacity-0',
      'translate-y-4',
      'transition',
      'duration-700',
      'ease-out'
    );

    if (delay > 0) {
      el.style.transitionDelay = `${delay}ms`;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.remove('opacity-0', 'translate-y-4');
            el.classList.add('opacity-100', 'translate-y-0', 'reveal-glow');

            setTimeout(() => {
              el.classList.remove('reveal-glow');
            }, 600);

            obs.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);
    // @ts-expect-error – propriedade custom
    el.__scrollRevealObserver = observer;
  },

  unmounted(el) {
    // @ts-expect-error – propriedade custom
    const observer: IntersectionObserver | undefined = el.__scrollRevealObserver;
    if (observer) {
      observer.disconnect();
    }
  },
};

export default scrollReveal;
