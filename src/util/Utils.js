import loaderImg from './../assets/loader.svg';

export const addVideoNode = (participant, stream, screenshare = false) => {
    let participantVideoNode = document.getElementById(screenshare ? 'screenshare-video' : `video-${participant.info.externalId}`);
    if (!participantVideoNode) {
        participantVideoNode = document.createElement('video');
        participantVideoNode.setAttribute('id', 'video-' + (screenshare ? 'screenshare' : participant.id));
        participantVideoNode.setAttribute('height', 'calc(100% - 200px)');
        participantVideoNode.setAttribute('width', '100%');
        participantVideoNode.setAttribute("playsinline", true);
        participantVideoNode.setAttribute("overflow", 'hidden');
        participantVideoNode.muted = true;
        participantVideoNode.setAttribute("autoplay", 'autoplay');
        const participantContainer = document.getElementById(screenshare ? 'screenshare' : `video-container-${participant.info.externalId}`);
        if (participantContainer) {
            participantContainer.classList.add('video');
            participantContainer.appendChild(participantVideoNode);
        }
    }
    navigator.attachMediaStream(participantVideoNode, stream);
}

export const removeScreenshareNode = () => {
    const screenshare = document.getElementById('video-screenshare');
    if (screenshare) {
        screenshare.remove();
    }
}

export const removeVideoNode = (participant) => {
    const participantContainer = document.getElementById(`video-container-${participant.info.externalId}`);
    if (participantContainer) {
        participantContainer.classList.remove('video');
        let participantVideoNode = document.getElementById('video-' + participant.id);
        if (participantVideoNode)
            participantContainer.removeChild(participantVideoNode)
    }
}

export const toTitleCase = (str) => {
    if (!str) {
        return '';
    }
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const showLoader = () => {
    let loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
        return;
    }
    loaderWrapper = document.createElement('div');
    loaderWrapper.id = 'loader-wrapper';
    loaderWrapper.style.width = '100vw';
    loaderWrapper.style.height = '100vh';
    loaderWrapper.style.position = 'absolute';
    loaderWrapper.style.top = '0';
    loaderWrapper.style.zIndex = '999';
    loaderWrapper.style.background = '#0006';
    loaderWrapper.style.display = 'flex';
    loaderWrapper.style.justifyContent = 'center';
    loaderWrapper.style.alignItems = 'center';
    const loader = document.createElement('img');
    loader.height = '100';
    loader.width = '100';
    loader.src = loaderImg;
    loaderWrapper.appendChild(loader);
    document.body.appendChild(loaderWrapper);
}

export const hideLoader = () => {
    let loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
        document.body.removeChild(loaderWrapper);
    }
}

export const getAlphabetColor = (alphabet) => {
    return background[toTitleCase(alphabet)];
}

export const changeColorContrast = (col, amt) => {
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}


const background = {
    'A': '#71DFE7',
    'B': '#B4C6A6',
    'C': '#FF5F7E',
    'D': '#77E4D4',
    'E': '#678983',
    'F': '#FDA65D',
    'G': '#4E9F3D',
    'H': '#C89595',
    'I': '#9D84B7',
    'J': '#AAA492',
    'K': '#AB6D23',
    'L': '#39A388',
    'M': '#FF7777',
    'N': '#678983',
    'O': '#664E88',
    'P': '#63B4B8',
    'Q': '#A9E4D7',
    'R': '#94B3FD',
    'S': '#678983',
    'T': '#3D56B2',
    'U': '#6D8299',
    'V': '#63B4B8',
    'W': '#57CC99',
    'X': '#C36839',
    'Y': '#F8485E',
    'Z': '#7B6079'
}