/* eslint-disable react/prop-types */
jest.mock('./show-more-tabs/index.js', () => ({
    __esModule: true, // this property makes it work
    default: 'ShowMoreTabs',
    namedExport: jest.fn(),
}));
import React from 'react';
import showMorePlugin from './index.js';
let ctx;
beforeAll(() => {
});
beforeEach(() => {
    ctx = {
        optionsManager: {
            setting: {
                tablistOverflowClass: '',
                responsiveClass: ''
            },
            internalOptions: {
                TablistOverflow: null,
                ShowMoreButton: null,
            }
        }
    };
});
afterEach(() => {
    ctx = null;
});
afterAll(() => {
});
describe('constructor ', () => {
    test('it should set setting.responsiveClass', () => {
        expect(ctx.optionsManager.setting.responsiveClass).toBe('');
        showMorePlugin(ctx);
        expect(ctx.optionsManager.setting.responsiveClass).toBe('rc-dyn-tabs-responsive');
    });
    test('it should set TablistOverflow and ShowMoreButton of internal options', () => {
        expect(ctx.optionsManager.internalOptions.TablistOverflow == null).toBe(true);
        expect(ctx.optionsManager.internalOptions.ShowMoreButton == null).toBe(true);
        showMorePlugin(ctx);
        expect(ctx.optionsManager.internalOptions.TablistOverflow == null).toBe(false);
        expect(ctx.optionsManager.internalOptions.ShowMoreButton == null).toBe(false);
    });
});
