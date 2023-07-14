import useSettings from '../hooks/useSettings';

export default function SettingsMenu() {
    const [settings,setSettings] = useSettings();

    return (
        <>
            <PDFItem settings={settings} setSettings={setSettings} settingsKey="resume" title="Resume" />
            <PDFItem settings={settings} setSettings={setSettings} settingsKey="jobDescription" title="Job Description" />
        </>
    )
}

function PDFItem({ settings, setSettings, settingsKey, title }) {
    function updateSetting(value) {
        const result = {...settings};
        result[settingsKey] = value;
        setSettings(result);
    }

    function readPDFText(event) {
        return new Promise((resolve,reject) => {
            const file = event.target.files[0];
            const fileReader = new FileReader();

            fileReader.onload = function() {
                const typedarray = new Uint8Array(this.result);

                // eslint-disable-next-line no-undef
                const loadingTask = pdfjsLib.getDocument(typedarray);
                loadingTask.promise.then(pdf => {
                    const maxPages = pdf._pdfInfo.numPages;
                    const countPromises = [];

                    for ( let j = 1; j <= maxPages; j++ ) {
                        const page = pdf.getPage(j);

                        countPromises.push(page.then(page => {
                            const textContent = page.getTextContent();

                            return textContent.then(text => {
                                return text.items.map(item => item.str).join("");
                            });
                        }));
                    }

                    return Promise.all(countPromises).then(texts => {
                        console.log(texts);
                        resolve(texts.join(""));
                    });
                });
            };

            fileReader.readAsArrayBuffer(file);
        });
    }

    return (
        <>
            <p className="text-center">
                <u>{ title }</u>
            </p>
            <p>
                <span>Copy and paste, or upload a PDF:</span>
                <input type="file" onChange={async e => updateSetting(await readPDFText(e))} />
            </p>
            <textarea class="form-control" rows="3" placeholder={`${title}...`} value={settings[settingsKey]} onChange={e => updateSetting(e.target.value)}></textarea>
            <hr />
        </>
    );
}