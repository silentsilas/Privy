import Settings from './Settings.js';

export default class {

    static createComponent({richActor, combinations}) {
        const container = document.createElement("div");
        container.classList.add('crack_container');

        let guessesPerSecond;
        switch (richActor) {
            case 'guy':
                richActor = 'that one sketchy dude in a black hoodie at your local coffee shop'
                guessesPerSecond = 100000000000;
                break;
            case 'company':
                richActor = 'Evil Corp'
                guessesPerSecond = 1000000000000;
                break;
            case 'state':
                richActor = 'Big Brother'
                guessesPerSecond = 100000000000000;
                break;
            case 'universe':
                richActor = 'the Illuminati';
                guessesPerSecond = 1000000000000000;
                break;
            default:
                throw new Error("Invalid actor.");
        }

        // total time to go through all combinations
        let guarantee = (combinations / guessesPerSecond);

        let timescale = 'seconds';
        // break it down into desired scale of time
        if (guarantee > 60) {
            timescale = 'minutes';
            guarantee = guarantee / 60;
        }
        if (guarantee > 60) {
            timescale = 'hours';
            guarantee = guarantee / 60;
        }
        if (guarantee > 24) {
            timescale = 'days';
            guarantee = guarantee / 24;
        }
        if (guarantee > 365) {
            timescale = 'years';
            guarantee = guarantee / 365;
        }
        if (guarantee > 1000) {
            timescale = 'millennia';
            guarantee = guarantee / 1000;
        }
        if (guarantee > 1000) {
            timescale = 'million years';
            guarantee = guarantee / 1000;
        }
        if (guarantee > 1000) {
            timescale = 'billion years';
            guarantee = guarantee / 1000;
        }
        if (guarantee > 1000) {
            timescale = 'trillion years';
            guarantee = guarantee / 1000;
        }
        

        // now actually create the HTML component
        const header = document.createElement("div");
        header.classList.add('crack_header');
        header.appendChild(document.createTextNode(
            `For ${richActor} to crack it:`
        ));
        container.appendChild(header);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add('crack_content');

        // the guaranteed text
        const guaranteeHeader = document.createElement("h3");
        guaranteeHeader.appendChild(document.createTextNode(
            'Guaranteed:'
        ));
        contentDiv.appendChild(guaranteeHeader);
        contentDiv.appendChild(document.createTextNode(
            `${guarantee.toLocaleString()} ${timescale}`
        ));

        // TODO: maybe turn guarantee + average into separate divs?
        contentDiv.appendChild(document.createElement('br'));

        // the average text
        const averageHeader = document.createElement("h3");
        averageHeader.appendChild(document.createTextNode(
            'Average:'
        ));
        contentDiv.appendChild(averageHeader);
        contentDiv.appendChild(document.createTextNode(
            `${(guarantee/2).toLocaleString()} ${timescale}`
        ));

        container.appendChild(contentDiv);

        return container;
    }

    static calculateEntropy(div) {
        let range = 0;
        range += Settings.uppercase.allowed ? Settings.uppercase.COUNT : 0;
        range += Settings.lowercase.allowed ? Settings.lowercase.COUNT : 0;
        range += Settings.digits.allowed ? Settings.digits.COUNT : 0;
        const entropyPerCharacter = Math.log2(range);
        const combinations = Math.pow(range, Settings.password_length);
        const totalEntropy = entropyPerCharacter * Settings.password_length;

        const entropyDiv = document.createElement('div');
        entropyDiv.classList.add('entropy');

        entropyDiv.appendChild(document.createTextNode(`Unique Characters: ${range}`));
        entropyDiv.appendChild(document.createElement('br'));
        entropyDiv.appendChild(document.createTextNode(`Total Password Combinations: ${combinations.toLocaleString()}`));
        entropyDiv.appendChild(document.createElement('br'));
        entropyDiv.appendChild(document.createTextNode(`Entropy: ${totalEntropy}`));
        entropyDiv.appendChild(document.createElement('br'));
        div.appendChild(entropyDiv);

        div.appendChild(this.createComponent({
            richActor: 'guy',
            combinations: combinations
        }));
        div.appendChild(this.createComponent({
            richActor: 'company',
            combinations: combinations
        }));
        div.appendChild(this.createComponent({
            richActor: 'state',
            combinations: combinations
        }));
        div.appendChild(this.createComponent({
            richActor: 'universe',
            combinations: combinations
        }));

        div.innerHTML += '<br>Going by this chart: <a href="http://i.imgur.com/e3mGIFY.png">http://i.imgur.com/e3mGIFY.png</a><br><br>';
        console.log(Math.log2(100000) * 4);
    }
}