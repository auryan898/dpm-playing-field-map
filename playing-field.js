async function numberValueXmlToElements(xmlFileUrl) {
    const response = await fetch(xmlFileUrl);
    const text = await response.text();
    var root = new DOMParser().parseFromString(text, 'text/xml');
    var nodes = root.getElementsByTagName('value');
    for (var i = 0; i < nodes.length; i++) {
        let id = nodes[i].getAttribute('key');
        let val = nodes[i].textContent
        try {
            document.getElementById(id).value = parseInt(val);
        } catch (err) {
            console.log(err);
        }
    }
}