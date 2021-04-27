import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css'

const zeroPad = (num, places) => String(num).padStart(places, '0')

const initialValues = {
    beginAt: "1",
    count: "1",
    title: "tanuki",
}

const maxImagesCount = 50;

const Index = () => {
    const [values, setValues] = useState(initialValues);
    const [imageNames, setImageNames] = useState([]);


    const handleClick = async (evt) => {
        evt.preventDefault();
        setImageNames([]);
        await downloadImages(values["beginAt"], values["count"]);
    }

    function handleInputChange(evt) {
        const { name, value } = evt.target;
        setValues({ ...values, [name]: value });
    }

    const downloadImages = async (beginStr, countStr) => {
        try {
            const begin = parseInt(beginStr);
            const count = parseInt(countStr);
            for (let i = begin; i <= begin + count - 1; i++) {
                console.log(`calling from ${begin} ${count} times till ${begin + count} > current (${i})`);
                await downloadImage(i);
            }
        } catch (err) { console.log(err); }
    }

    const downloadImage = async (item) => {
        try {
            const fileName = `${values.title}${zeroPad(item, 3)}.jpg`;
            console.log("filename", fileName);
            const response = await fetch(`/api/fetcher/${fileName}`);
            if (response.status !== 200) return;
            const blob = await response.blob();
            const blobURL = window.URL.createObjectURL(blob);

            setImageNames(i => [...i, blobURL]);
            //var myImage = document.querySelector('img');
            //myImage.src = blobURL;

            const a = document.createElement("a");
            a.href = blobURL;
            a.style = "display: none";
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='maincontainer'>
            <div className="jumbotrun text-center">
                <h1>Let's crawl</h1>
            </div>
            <div className="container-fluid" >
                <div className="row selectionPanel">
                    <div className='col'>
                        <select
                            className="form-select" name='title'
                            value={values.title} onChange={handleInputChange}>
                            <option>totoro</option>
                            <option>laputa</option>
                            <option>chihiro</option>
                            <option>omoide</option>
                            <option>tanuki</option>
                        </select>
                    </div>
                    <div className='col'>
                        <label htmlFor="beginAt">Begin</label>
                        <select
                            onChange={handleInputChange}
                            name="beginAt"
                            className='form-select'>{Array(maxImagesCount).fill(1).map((x, y) => x + y)
                                .map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                    </div>
                    <div className='col'>
                        <div>
                            <label htmlFor="count">Count</label>
                            <select
                                onChange={handleInputChange}
                                name="count"
                                className='form-select'>{Array(maxImagesCount - values.beginAt + 1).fill(1).map((x, y) => x + y)
                                    .map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className='col'>
                        <button className="btn btn-primary"
                            onClick={handleClick}>crawl</button>
                    </div>
                </div>
                <div>
                    {imageNames.map(i => <img key={i} src={i} width='50%' />)}
                </div>
            </div>
        </div>
    )
}

export default Index