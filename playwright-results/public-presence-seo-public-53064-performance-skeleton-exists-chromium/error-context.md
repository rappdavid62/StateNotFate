# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public\presence-seo.spec.ts >> public presence SEO/performance skeleton exists
- Location: tests\public\presence-seo.spec.ts:3:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "Failed to load resource: net::ERR_NETWORK_ACCESS_DENIED",
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to public project information" [ref=e2] [cursor=pointer]:
    - /url: "#public-main"
  - banner [ref=e3]:
    - navigation "Public site navigation" [ref=e4]:
      - link "State Not Fate" [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e6]:
        - link "Learn" [ref=e7] [cursor=pointer]:
          - /url: "#learn"
        - link "Start / Try the program" [ref=e8] [cursor=pointer]:
          - /url: "#program"
        - link "Evidence / Sources" [ref=e9] [cursor=pointer]:
          - /url: /evidence
        - link "Suicide Prevention" [ref=e10] [cursor=pointer]:
          - /url: /suicide-prevention
        - link "Contact / Join" [ref=e11] [cursor=pointer]:
          - /url: /contact
        - link "Crisis Help" [ref=e12] [cursor=pointer]:
          - /url: /crisis
  - main [ref=e13]:
    - region "State Not Fate" [ref=e14]:
      - paragraph [ref=e15]: Depression Project
      - heading "State Not Fate" [level=1] [ref=e16]
      - paragraph [ref=e17]: State Not Fate is proof-based depression support that treats depression as functional system disruption, not moral failure.
      - generic [ref=e18]:
        - link "Try the local beta" [ref=e19] [cursor=pointer]:
          - /url: "#screen-welcome"
        - link "Review sources" [ref=e20] [cursor=pointer]:
          - /url: /evidence
    - region "Project overview" [ref=e21]:
      - article [ref=e22]:
        - heading "What it is" [level=2] [ref=e23]
        - paragraph [ref=e24]: A low-friction recovery framework focused on action-before-motivation, proof-based hope, restart speed, and practical daily anchors.
      - article [ref=e25]:
        - heading "What it is not" [level=2] [ref=e26]
        - paragraph [ref=e27]: State Not Fate is adjunctive support, not a replacement for professional care, therapy, medical care, or emergency services.
      - article [ref=e28]:
        - heading "Safety first" [level=2] [ref=e29]
        - paragraph [ref=e30]: If there is immediate danger, call your local emergency number, contact a local crisis line, or use a trusted urgent support service. In the U.S. and Canada, 988 is one option.
  - text: ➔ ➔ ➔ ➔ ➔ ➔ ➔ ● ONLINE
  - generic [ref=e31]:
    - text: "⚠ TESTING / PROTOTYPE BUILD — Not a medical service. This is an adjunctive self-management tool, not a substitute for professional care. If in crisis: call/text"
    - strong [ref=e32]: "988"
    - text: .
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | test('public presence SEO/performance skeleton exists', async ({ page }) => {
  4  |   const errors: string[] = [];
  5  |   page.on('console', (message) => {
  6  |     if (message.type() === 'error') errors.push(message.text());
  7  |   });
  8  | 
  9  |   const started = Date.now();
  10 |   const response = await page.goto('/');
  11 |   const elapsed = Date.now() - started;
  12 | 
  13 |   expect(response?.ok()).toBeTruthy();
  14 |   await expect(page).toHaveTitle(/State,? Not Fate|Depression Project/i);
  15 |   await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /depression/i);
  16 |   await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /State Not Fate/i);
  17 |   await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /depression/i);
  18 |   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$/);
> 19 |   expect(errors).toEqual([]);
     |                  ^ Error: expect(received).toEqual(expected) // deep equality
  20 |   expect(elapsed).toBeLessThan(3000);
  21 | 
  22 |   expect((await page.goto('/robots.txt'))?.ok()).toBeTruthy();
  23 |   await expect(page.locator('body')).toContainText('Sitemap');
  24 | 
  25 |   expect((await page.goto('/sitemap.xml'))?.ok()).toBeTruthy();
  26 |   await expect(page.locator('body')).toContainText('/evidence');
  27 | 
  28 |   const notFound = await page.goto('/missing-page-for-public-test');
  29 |   expect(notFound?.status()).toBe(404);
  30 |   await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
  31 | });
  32 | 
```