import { test, expect } from '@playwright/test';

const PAGES = [
  '/ru',
  '/ru/wallpapers',
  '/ru/packs',
  '/ru/pricing',
  '/ru/about',
  '/ru/faq',
  '/ru/download',
  '/ru/support',
];

test.describe('доступность и адаптив', () => {
  for (const path of PAGES) {
    test(`${path}: один h1, изображения с alt, без горизонтального скролла`, async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('livewalls:onboarding-seen', '1'));
      await page.goto(path, { waitUntil: 'networkidle' });

      expect(await page.locator('h1').count()).toBe(1);

      const imgsWithoutAlt = await page.locator('img:not([alt])').count();
      expect(imgsWithoutAlt).toBe(0);

      const linksWithoutName = await page
        .locator('a:visible')
        .evaluateAll(
          (els) =>
            els.filter((el) => !el.textContent?.trim() && !el.getAttribute('aria-label')).length,
        );
      expect(linksWithoutName).toBe(0);

      for (const width of [360, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `переполнение на ${width}px`).toBeLessThanOrEqual(1);
      }
    });
  }
});
