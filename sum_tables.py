from playwright.sync_api import sync_playwright

def sum_js_tables(base_url: str, seeds: list[str]) -> int:
    """
    Uses Playwright to visit multiple pages, finds all numbers in tables,
    and returns their sum.

    Args:
        base_url (str): The base URL for the pages.
        seeds (list[str]): A list of seeds to generate the full URLs.

    Returns:
        int: The total sum of all numbers found in the tables.
    """
    total_sum = 0

    with sync_playwright() as p:
        # Launch a headless browser (headless=True means no UI is shown)
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for seed in seeds:
            url = f"{base_url}?seed={seed}"
            print(f"Navigating to {url}...")

            try:
                page.goto(url, wait_until="domcontentloaded")

                # Use a locator to find all table cells (td)
                # Playwright's locators auto-wait, which is robust
                cells = page.locator("td")

                # Get the count for logging
                cell_count = cells.count()
                print(f"  Found {cell_count} cells.")

                # Iterate through each cell and add its value to the sum
                for i in range(cell_count):
                    cell_text = cells.nth(i).inner_text()
                    if cell_text.isdigit():
                        total_sum += int(cell_text)

            except Exception as e:
                print(f"  An error occurred on page {url}: {e}")
                continue # Move to the next seed

        # Close the browser instance
        browser.close()

    return total_sum


if __name__ == "__main__":
    # --- Replace these with the values from your question ---
    # The problem specifies a range of seeds to use.
    # For example, if the start seed is 76 and the end seed is 85:
    start_seed = 76
    end_seed = 85
    SEEDS_TO_PROCESS = [str(i) for i in range(start_seed, end_seed + 1)]
    BASE_URL = "https://sanand0.github.io/tdsdata/js_table/"
    # ---------------------------------------------------------

    print(f"Processing seeds: {SEEDS_TO_PROCESS}")
    final_sum = sum_js_tables(BASE_URL, SEEDS_TO_PROCESS)

    print("\n--- Result ---")
    print(f"The total sum of all numbers in the tables is: {final_sum}")
    print("----------------\n")
