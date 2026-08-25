/**
 * SAFE SUPPORT ROUTING MODULE
 *
 * State Not Fate — non-clinical recovery app
 *
 * Scope: route users in distress to crisis resources and trusted contacts.
 * This module does NOT generate risk scores, risk categories, or ask
 * method-specific assessment questions.  It must remain within the
 * boundaries described in the suicide-prevention compendium.
 *
 * Responsibilities:
 *   - Pause ordinary coaching and proof rewards
 *   - Present crisis and emergency resources
 *   - Expose the user's saved trusted contacts
 *   - Offer a brief help-request script
 *   - Support region-aware resource configuration
 *   - Record only that safety routing was opened (no clinical data)
 */

export const DEFAULT_REGION_RESOURCES = {
    us: {
        line988: { label: 'Call or text 988', href: 'tel:988' },
        crisis: { label: 'Crisis Text Line – text HOME to 741741', href: 'sms:741741?body=HOME' },
        emergency: { label: 'Call 911', href: 'tel:911' }
    },
    ca: {
        line988: { label: 'Talk Suicide Canada – 1-833-456-4566', href: 'tel:18334564566' },
        crisis: { label: 'Crisis Text Line – text HOME to 686868', href: 'sms:686868?body=HOME' },
        emergency: { label: 'Call 911', href: 'tel:911' }
    },
    uk: {
        line988: { label: 'Samaritans – 116 123', href: 'tel:116123' },
        crisis: { label: 'PAPYRUS HOPELineUK – 0800 068 4141', href: 'tel:08000684141' },
        emergency: { label: 'Call 999', href: 'tel:999' }
    },
    au: {
        line988: { label: 'Lifeline – 13 11 14', href: 'tel:131114' },
        crisis: { label: 'Beyond Blue – 1300 22 4636', href: 'tel:1300224636' },
        emergency: { label: 'Call 000', href: 'tel:000' }
    }
};

export const HELP_REQUEST_SCRIPT =
    "I'm not feeling safe right now and I need to talk to someone. " +
    "Can you stay with me for a few minutes?";

export class SafetyRouting {
    /**
     * @param {object} options
     * @param {string} [options.region]       Two-letter region key (default: 'us')
     * @param {object} [options.extraResources] Region-keyed resource overrides
     */
    constructor({ region = 'us', extraResources = {} } = {}) {
        this._region = region.toLowerCase();
        this._resources = {
            ...DEFAULT_REGION_RESOURCES,
            ...extraResources
        };
    }

    /** Region key currently active */
    get region() { return this._region; }

    /** Change the active region */
    setRegion(region) {
        this._region = region.toLowerCase();
    }

    /**
     * Return the crisis/emergency links for the active region,
     * falling back to 'us' when the region is unknown.
     * @returns {{ line988: object, crisis: object, emergency: object }}
     */
    getResources() {
        return this._resources[this._region] || this._resources['us'];
    }

    /**
     * Return the saved trusted contacts from app state.
     * @param {object} state  App localStorage state
     * @returns {string}
     */
    getTrustedContacts(state = {}) {
        return (state && state.safeContacts) ? state.safeContacts : '';
    }

    /**
     * Return the canned help-request script the user can read aloud.
     * @returns {string}
     */
    getHelpScript() {
        return HELP_REQUEST_SCRIPT;
    }

    /**
     * Pause ordinary quests and proof rewards in the given Polaris state.
     * Does NOT alter any other state.  The caller must persist state.
     * @param {object} polaris  state.polaris object (mutated in place)
     * @returns {object} the mutated polaris object
     */
    pauseCoaching(polaris = {}) {
        polaris.safetyRoutingActive = true;
        if (polaris.quests) {
            polaris.quests._pausedBySafetyRouting = true;
        }
        return polaris;
    }

    /**
     * Resume ordinary quests and proof rewards.
     * @param {object} polaris  state.polaris object (mutated in place)
     * @returns {object} the mutated polaris object
     */
    resumeCoaching(polaris = {}) {
        polaris.safetyRoutingActive = false;
        if (polaris.quests) {
            polaris.quests._pausedBySafetyRouting = false;
        }
        return polaris;
    }

    /**
     * Record that safety routing was opened.  Records only a timestamp —
     * no clinical detail, no risk score, no method information.
     * @param {object} state  App localStorage state (mutated in place)
     * @returns {object} the mutated state
     */
    recordRoutingOpened(state = {}) {
        state.safetyRoutingLog = state.safetyRoutingLog || [];
        state.safetyRoutingLog.push({ openedAt: new Date().toISOString() });
        return state;
    }
}

export default SafetyRouting;
