import path from 'path';

const storage = {
    name: 'storage',
    connector: 'loopback-component-storage',
    provider: 'filesystem',
    root: path.join(__dirname, '../', '../', '../', 'storage')
};

export default storage;
