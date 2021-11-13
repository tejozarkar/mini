
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
        if (participantContainer) {
            participantContainer.appendChild(participantVideoNode);
        }
    }
    navigator.attachMediaStream(participantVideoNode, stream);
}

export const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

