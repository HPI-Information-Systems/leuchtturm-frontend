const results = (state = [], action) => {
    switch (action.type) {
        case 'SUBMIT_SEARCH':
            return state = [
                {
                    docId: '0000000_0001_000000404',
                    snippets: [
                        {
                            text: '... snippet 1 ...',
                            position: 214,
                        },
                        {
                            text: '... snippet 2 ...',
                            position: 215,
                        },
                    ],
                },
                {
                    docId: '0000000_0001_000000712',
                    snippets: [
                        {
                            text: '... snippet 3 ...',
                            position: 216,
                        },
                        {
                            text: '... snippet 4 ...',
                            position: 217,
                        },
                        {
                            text: '... snippet 5 ...',
                            position: 219,
                        },
                    ],
                },
            ];
        default:
            return state;
    }
};

export default results;