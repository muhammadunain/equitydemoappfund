async function handleAddStakeholder() {
    const stakeholder = {
        id: generateUUID(), // Ensure this generates a valid UUID
        name: "Preferred A",
        // ... other properties ...
    };

    try {
        await database.create(stakeholder);
    } catch (error) {
        console.error("Error in creating stakeholder:", error);
    }
} 