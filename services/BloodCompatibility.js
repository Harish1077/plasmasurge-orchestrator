// Immutable antigen cross-transfusion matrix maps
const DONORS_FOR_RECIPIENT = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

function getCompatibleDonorGroups(neededGroup) { return DONORS_FOR_RECIPIENT[neededGroup] || []; }
function isCompatible(donorGroup, neededGroup) { return getCompatibleDonorGroups(neededGroup).includes(donorGroup); }
function isExactMatch(donorGroup, neededGroup) { return donorGroup === neededGroup; }

module.exports = { getCompatibleDonorGroups, isCompatible, isExactMatch };