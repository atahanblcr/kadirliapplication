#!/usr/bin/env node

// KadirliApp - Admin Panel UI Comprehensive Test Suite
// Tests all admin panel pages with Playwright
// Author: Claude Code
// Date: 2026-02-24

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'admin@kadirliapp.com';
const ADMIN_PASSWORD = 'Admin123!';
const OUTPUT_DIR = './test-results';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Color codes
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
};

// Test stats
let totalTests = 0;
let passedTests = 0;
let failedTests = [];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(passed, page, error = '') {
    totalTests++;
    if (passed) {
        passedTests++;
        console.log(`${colors.green}✓${colors.reset} ${page}`);
    } else {
        failedTests.push({ page, error });
        console.log(`${colors.red}✗${colors.reset} ${page} ${error ? `(${error})` : ''}`);
    }
}

async function captureScreenshot(page, filename) {
    const filePath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: filePath, fullPage: true });
    return filePath;
}

async function testPage(page, url, description) {
    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });

        // Check if page has any error messages
        const errorElements = await page.$$('[role="alert"]');
        const hasErrors = errorElements.length > 0;

        if (hasErrors) {
            const errorText = await page.$eval('[role="alert"]', el => el.textContent);
            logTest(false, description, errorText?.substring(0, 50));
            return false;
        }

        logTest(true, description);
        return true;
    } catch (error) {
        logTest(false, description, error.message?.substring(0, 50));
        return false;
    }
}

// ============================================================================
// MAIN TEST SUITE
// ============================================================================

async function runTests() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewportSize({ width: 1920, height: 1080 });

    log('\n═════════════════════════════════════════════════════════════════', 'blue');
    log('KadirliApp Admin Panel - UI Test Suite', 'blue');
    log('═════════════════════════════════════════════════════════════════\n', 'blue');

    // ─── Test 1: Login ───────────────────────────────────────────────────────
    log('\n1. AUTHENTICATION TEST', 'blue');
    log('─────────────────────────────────────────────────────────────────\n');

    try {
        log('  1.1 Visiting login page...');
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });

        log('  1.2 Entering credentials...');
        await page.fill('input[name="email"]', ADMIN_EMAIL);
        await page.fill('input[name="password"]', ADMIN_PASSWORD);

        log('  1.3 Submitting login form...');
        await page.click('button:has-text("Giriş Yap")');

        // Wait for redirect to dashboard
        await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 });

        const currentUrl = page.url();
        if (currentUrl.includes('/dashboard') || currentUrl.includes('/ads')) {
            logTest(true, 'Admin Login');
        } else {
            logTest(false, 'Admin Login', `Unexpected redirect to ${currentUrl}`);
        }
    } catch (error) {
        logTest(false, 'Admin Login', error.message.substring(0, 50));
    }

    // ─── Test 2: Dashboard ───────────────────────────────────────────────────
    log('\n2. DASHBOARD TEST', 'blue');
    log('─────────────────────────────────────────────────────────────────\n');

    try {
        await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 10000 });

        // Check for stat cards
        const cards = await page.$$('.bg-white');
        if (cards.length > 0) {
            logTest(true, '  Dashboard - Stat Cards');
            await captureScreenshot(page, 'dashboard.png');
        } else {
            logTest(false, '  Dashboard - Stat Cards', 'No cards found');
        }
    } catch (error) {
        logTest(false, '  Dashboard', error.message.substring(0, 50));
    }

    // ─── Test 3: Sidebar Navigation ──────────────────────────────────────────
    log('\n3. SIDEBAR NAVIGATION TEST', 'blue');
    log('─────────────────────────────────────────────────────────────────\n');

    const pages = [
        { name: 'Ads', url: '/ads', selector: 'a[href*="/ads"]' },
        { name: 'Announcements', url: '/announcements', selector: 'a[href*="/announcements"]' },
        { name: 'Campaigns', url: '/campaigns', selector: 'a[href*="/campaigns"]' },
        { name: 'Complaints', url: '/complaints', selector: 'a[href*="/complaints"]' },
        { name: 'Deaths', url: '/deaths', selector: 'a[href*="/deaths"]' },
        { name: 'Events', url: '/events', selector: 'a[href*="/events"]' },
        { name: 'Guide', url: '/guide', selector: 'a[href*="/guide"]' },
        { name: 'Neighborhoods', url: '/neighborhoods', selector: 'a[href*="/neighborhoods"]' },
        { name: 'Pharmacy', url: '/pharmacy', selector: 'a[href*="/pharmacy"]' },
        { name: 'Places', url: '/places', selector: 'a[href*="/places"]' },
        { name: 'Settings', url: '/settings', selector: 'a[href*="/settings"]' },
        { name: 'Taxi', url: '/taxi', selector: 'a[href*="/taxi"]' },
        { name: 'Transport', url: '/transport', selector: 'a[href*="/transport"]' },
        { name: 'Users', url: '/users', selector: 'a[href*="/users"]' },
    ];

    for (const pageItem of pages) {
        await testPage(page, `${BASE_URL}${pageItem.url}`, `  ${pageItem.name} Page`);
    }

    // ─── Test 4: Check for broken links ──────────────────────────────────────
    log('\n4. PAGE INTEGRITY TEST', 'blue');
    log('─────────────────────────────────────────────────────────────────\n');

    // Collect all requests
    const failedRequests = [];
    page.on('response', response => {
        if (response.status() >= 400) {
            failedRequests.push({ url: response.url(), status: response.status() });
        }
    });

    // Reload a page to test
    await page.goto(`${BASE_URL}/users`, { waitUntil: 'networkidle' });

    if (failedRequests.length === 0) {
        logTest(true, '  No Failed Requests');
    } else {
        logTest(false, '  No Failed Requests', `${failedRequests.length} 4xx/5xx responses`);
        failedRequests.forEach(req => {
            console.log(`    - ${req.status} ${req.url.substring(0, 80)}`);
        });
    }

    // ─── Test 5: Logout ─────────────────────────────────────────────────────
    log('\n5. LOGOUT TEST', 'blue');
    log('─────────────────────────────────────────────────────────────────\n');

    try {
        await page.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle' });

        // Find and click logout button (usually in profile menu)
        const profileMenu = await page.$('button:has-text("Profil")') || await page.$('[aria-label*="Profile"]');

        if (profileMenu) {
            await profileMenu.click();
            await page.waitForTimeout(500);

            // Look for logout button
            const logoutBtn = await page.$('text=Çıkış') || await page.$('text=Logout');
            if (logoutBtn) {
                await logoutBtn.click();
                await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 });

                const afterLogoutUrl = page.url();
                if (afterLogoutUrl.includes('/login')) {
                    logTest(true, '  Logout');
                } else {
                    logTest(false, '  Logout', `Did not redirect to login`);
                }
            } else {
                logTest(false, '  Logout', 'Logout button not found');
            }
        } else {
            log('  ⚠ Profile menu not found, skipping logout test', 'yellow');
        }
    } catch (error) {
        logTest(false, '  Logout', error.message.substring(0, 50));
    }

    // ─── Cleanup ────────────────────────────────────────────────────────────
    await page.close();
    await browser.close();

    // ─── Final Report ───────────────────────────────────────────────────────
    log('\n═════════════════════════════════════════════════════════════════', 'blue');
    log('TEST SUMMARY', 'blue');
    log('═════════════════════════════════════════════════════════════════\n', 'blue');

    console.log(`Total Tests:     ${colors.yellow}${totalTests}${colors.reset}`);
    console.log(`Passed:          ${colors.green}${passedTests}${colors.reset}`);
    console.log(`Failed:          ${colors.red}${failedTests.length}${colors.reset}`);

    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    console.log(`Pass Rate:       ${colors.yellow}${passRate}%${colors.reset}`);

    if (failedTests.length > 0) {
        console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
        failedTests.forEach(test => {
            console.log(`  - ${test.page} ${test.error}`);
        });
    }

    console.log(`\nScreenshots saved to: ${OUTPUT_DIR}/`);
    console.log(`\n${passRate === 100 ? colors.green : colors.yellow}${passRate === 100 ? '✅ All tests passed!' : '⚠ Some tests failed'}${colors.reset}\n`);

    return failedTests.length === 0 ? 0 : 1;
}

// Run tests
runTests().then(code => process.exit(code));
