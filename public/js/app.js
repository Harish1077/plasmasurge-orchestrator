const BLOOD_MAPPINGS = {
    'A+': { bg: 'rgba(239,68,68,0.15)', text: '#fca5a5' },
    'A-': { bg: 'rgba(248,113,113,0.1)', text: '#fecaca' },
    'B+': { bg: 'rgba(59,130,246,0.15)', text: '#93c5fd' },
    'B-': { bg: 'rgba(96,165,250,0.1)', text: '#bfdbfe' },
    'O+': { bg: 'rgba(249,115,22,0.15)', text: '#fdba74' },
    'O-': { bg: 'rgba(251,146,60,0.1)', text: '#fed7aa' },
    'AB+': { bg: 'rgba(168,85,247,0.15)', text: '#d8b4fe' },
    'AB-': { bg: 'rgba(192,132,252,0.1)', text: '#e9d5ff' }
};

function bloodPill(group) {
    const ui = BLOOD_MAPPINGS[group] || {
        bg: 'rgba(255,255,255,0.1)',
        text: '#fff'
    };

    return `
        <span 
            class="px-2 py-1 rounded text-xs font-bold inline-block"
            style="
                background:${ui.bg};
                color:${ui.text};
                border:1px solid ${ui.text}44;
            "
        >
            ${group}
        </span>
    `;
}

function initials(name) {
    return (name || '?')
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

async function api(path, options = {}) {
    try {
        const res = await fetch(path, options);

        if (!res.ok) {
            let errData = {};

            try {
                errData = await res.json();
            } catch {}

            throw new Error(
                errData.error ||
                `HTTP ${res.status} : Request Failed`
            );
        }

        return await res.json();

    } catch (err) {
        console.error(err);
        throw err;
    }
}

function renderEmergencyCard(e) {

    const verified = e.hospitalVerified
        ? `
            <span class="badge-verified ml-2">
                ✓ VERIFIED
            </span>
        `
        : '';

    const urgent = e.urgency === 'Critical'
        ? `
            <span class="critical-badge">
                CRITICAL
            </span>
        `
        : `
            <span class="stable-badge">
                STABLE
            </span>
        `;

    return `
        <div class="
            emergency-card
            frozen-card
            p-4
            rounded-xl
            flex
            justify-between
            items-center
            ${e.urgency === 'Critical' ? 'critical' : ''}
        ">

            <div class="space-y-2">

                <div class="flex items-center gap-2 flex-wrap">
                    ${bloodPill(e.requiredGroup)}
                    ${urgent}
                    ${verified}
                </div>

                <div>
                    <h4 class="text-white font-bold text-sm uppercase tracking-wide">
                        ${e.hospitalName}
                    </h4>

                    <p class="text-slate-400 text-xs mt-1">
                        ${e.location}
                    </p>
                </div>

            </div>

            <div class="text-right">

                <div class="text-[10px] text-slate-500 font-mono">
                    ${new Date(e.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>

            </div>

        </div>
    `;
}