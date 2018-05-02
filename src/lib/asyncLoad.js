const loadScript = url => {
    const script = document.createElement('script');
    script.src = url;
    $('body').append(script);
};

const loadScripts = urls => {
    urls.forEach(url => {
        loadScript(url);
    });
};

const loadLink = url => {
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'stylesheet';
    $('body').append(link);
};

const loadLinks = urls => {
    urls.forEach(url => {
        loadLink(url);
    });
};

export {
    loadLink, loadLinks, loadScript, loadScripts
};