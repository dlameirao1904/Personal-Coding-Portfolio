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
import { createVariations, vuetifyColors } from '../../theme';
import type { VAlert, VTextarea, VAutocomplete, VTextField, VSwitch, VBtn, VFileInput, VSelect, VDataTableServer, VDataTableVirtual, VExpansionPanels, VCard, VDatePicker, VSkeletonLoader } from 'vuetify/lib/components/index.mjs';
import { VDateInput } from 'vuetify/labs/VDateInput'
import _ from 'lodash';
import 'vuetify/styles';

const colors = vuetifyColors();

// check localStorage for theme color
const themeColor = localStorage.getItem('themeColor');
if (themeColor) {
    const newColors = createVariations({ primary: themeColor });
    _.merge(colors, newColors);
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    defaults: {
        VTextField: {
            hideDetails: 'auto',
            variant: 'outlined',
            hideSpinButtons: true,
            color: 'primary',
        } as VTextField['$props'],
        VBtn: {
            elevation: 0,
        } as VBtn['$props'],
        VAutocomplete: {
            hideDetails: 'auto',
            variant: 'outlined',
            color: 'primary',
        } as VAutocomplete['$props'],
        VTextarea: {
            hideDetails: 'auto',
            autoGrow: true,
            variant: 'outlined',
            color: 'primary',
        } as VTextarea['$props'],
        VFileInput: {
            variant: 'outlined',
            hideDetails: 'auto',
            color: 'primary',
        } as VFileInput['$props'],
        VSwitch: {
            hideDetails: 'auto',
        } as VSwitch['$props'],
        VSelect: {
            variant: 'outlined',
            hideDetails: 'auto',
            color: 'primary',
        } as VSelect['$props'],
        VDataTableServer: {
            density: 'compact'
        } as VDataTableServer['$props'],
        VDataTableVirtual: {
            density: 'compact'
        } as VDataTableVirtual['$props'],
        VCard: {
            elevation: 0,
        } as VCard['$props'],
        VExpansionPanels: {
            density: 'compact',
            elevation: 0,
        } as VExpansionPanels['$props'],
        VDateInput: {
            variant: 'outlined',
            elevation: 2,
            color: 'primary',
        } as VDateInput['$props'],
        VDatePicker: {
            elevation: 0,
            color: 'primary',
        } as VDatePicker['$props'],
        VSkeletonLoader: {
            elevation: 0,
        } as VSkeletonLoader['$props'],
    },
    components: {
        VDateInput,
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
                colors
            },
        },
    },
});
