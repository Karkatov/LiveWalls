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

test.describe('модальные слои', () => {
  test('мобильное меню запирает фокус и закрывается по Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.setItem('livewalls:onboarding-seen', '1'));
    await page.goto('/ru', { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: /меню/i }).click();
    const dialog = page.getByRole('dialog', { name: /основная навигация/i });
    await expect(dialog).toBeVisible();

    // Фокус остаётся внутри панели после нескольких переходов по Tab.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
      expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('быстрый просмотр имеет доступное имя и закрывается по Escape', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('livewalls:onboarding-seen', '1'));
    await page.goto('/ru/wallpapers', { waitUntil: 'networkidle' });

    await page.locator('article').first().hover();
    await page
      .getByRole('button', { name: /быстрый просмотр|quick view/i })
      .first()
      .click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const name = await dialog.getAttribute('aria-label');
    expect(name?.trim().length ?? 0).toBeGreaterThan(0);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
