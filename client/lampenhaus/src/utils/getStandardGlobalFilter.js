import _ from 'lodash';

export default () => (_.cloneDeep({
    searchTerm: '',
    startDate: '',
    endDate: '',
    sender: '',
    recipient: '',
    selectedTopics: [],
    topicThreshold: 0.1,
    selectedEmailClasses: ['business', 'personal', 'spam'],
    selectedClusters: [],
}));
