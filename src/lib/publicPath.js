const getPublicPath = () => {
    const {host} = location;
    if (host.match(/local/) || !host) {
        return `http://${localIp}:3000/`;
    } else if (host.match(/192.168.3.31/)) {
        return '//192.168.3.30/zyfbim/dist/';
    } else if (host.match(/116.62.114.241/)) {
        //pro path
        return '//116.62.203.181/zyfbim/dist/';
    }
};
__webpack_public_path__ = getPublicPath();

