export const BANNED_OBJECTS = [
    // For some reason there are thousands of this same piece with different IDs
    // in the MET collection. We're going to exclude this one for now. Sorry, Nauny.
    {
        id: null, // null means that any object with this title will be excluded
        title: 'Worker Shabti of Nauny',
    },
]
