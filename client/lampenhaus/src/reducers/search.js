const search = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_SEARCH_TERM':
            return state.searchTerm = action.searchTerm;
        case 'SUBMIT_SEARCH':
            return state = {resultList: [
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
            ],
                isFetching:true};
        default:
            return state;
    }
};

export default search;