
export const addVideoNode = (participant, stream) => {
    let participantVideoNode = document.getElementById(`participant-${participant.info.externalId}`);
    if (!participantVideoNode) {
        participantVideoNode = document.createElement('video');
        participantVideoNode.setAttribute('id', 'video-' + participant.id);
        participantVideoNode.setAttribute('height', '100%');
        participantVideoNode.setAttribute('width', '100%');
        participantVideoNode.setAttribute("playsinline", true);
        participantVideoNode.muted = true;
        participantVideoNode.setAttribute("autoplay", 'autoplay');
        const participantContainer = document.getElementById(`video-container-${participant.info.externalId}`);
        participantContainer.classList.add('video');
        if (participantContainer) {
            participantContainer.appendChild(participantVideoNode);
        }
    }
    navigator.attachMediaStream(participantVideoNode, stream);
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

export const getAlphabetColor = (alphabet) => {
    return background[toTitleCase(alphabet)];
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