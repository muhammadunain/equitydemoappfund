async function create(stakeholder) {
    // Validate UUID before attempting to insert
    if (!isValidUUID(stakeholder.id)) {
        throw new Error(`Invalid UUID: ${stakeholder.id}`);
    }
    // ... existing code ...
}

// Function to validate UUID
function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
} 