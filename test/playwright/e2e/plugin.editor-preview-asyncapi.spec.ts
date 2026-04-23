import { test, expect } from '@playwright/test';

import {
  visitBlankPage,
  prepareAsyncAPI,
  prepareOasGenerator,
  waitForSplashScreen,
  waitForContentPropagation,
  clickNestedMenuItem,
} from '../helpers';

/**
 * Editor Preview Pane: AsyncAPI 2.x
 * Tests for AsyncAPI preview rendering
 *
 * Migrated from: test/cypress/e2e/plugin.editor-preview-asyncapi.cy.js
 */
test.describe('Editor Preview Pane: AsyncAPI 2.x', () => {
  test.beforeEach(async ({ page }) => {
    await visitBlankPage(page);
    await prepareAsyncAPI(page);
    await prepareOasGenerator(page);
    await waitForSplashScreen(page);
  });

  test('displays AsyncAPI 2.x.x', async ({ page }) => {
    // Load AsyncAPI example
    await clickNestedMenuItem(page, 'File', 'Load Example', 'AsyncAPI 2.6 Streetlights');
    await waitForContentPropagation(page);

    // Verify AsyncAPI preview elements are visible
    await expect(page.locator('#check-out-its-awesome-features')).toBeVisible();
    await expect(page.locator('.aui-root #introduction')).toBeVisible();
  });

  test('hidden if not AsyncAPI 2.x.x', async ({ page }) => {
    // Load OpenAPI example instead of AsyncAPI
    await clickNestedMenuItem(page, 'File', 'Load Example', 'OpenAPI 3.0 Petstore');
    await waitForContentPropagation(page);

    // Verify AsyncAPI preview elements are not present
    await expect(page.locator('#check-out-its-awesome-features')).not.toBeAttached();
    await expect(page.locator('.aui-root #introduction')).not.toBeAttached();
  });

  test('keeps the editor and preview splitter draggable for AsyncAPI examples', async ({
    page,
  }) => {
    await clickNestedMenuItem(page, 'File', 'Load Example', 'AsyncAPI 2.6 Petstore');
    await waitForContentPropagation(page);

    const resizer = page.locator('.Resizer.vertical').first();
    await expect(resizer).toBeVisible();

    const getPaneWidths = () =>
      page
        .locator('.Pane')
        .evaluateAll((elements) =>
          elements.map((element) => element.getBoundingClientRect().width)
        );

    const beforeWidths = await getPaneWidths();
    const resizerBox = await resizer.boundingBox();

    expect(resizerBox).not.toBeNull();

    if (!resizerBox) {
      return;
    }

    const dragX = resizerBox.x + resizerBox.width / 2;
    const dragY = resizerBox.y + Math.min(120, resizerBox.height / 2);

    await page.mouse.move(dragX, dragY);
    await page.mouse.down();
    await page.mouse.move(dragX + 180, dragY, { steps: 12 });
    await page.mouse.up();

    const afterWidths = await getPaneWidths();

    expect(afterWidths[0]).toBeGreaterThan(beforeWidths[0] + 100);
    expect(afterWidths[1]).toBeLessThan(beforeWidths[1] - 100);
  });
});
