import React, { useEffect} from "react";
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/MoveCar.module.css'
import { Link } from "react-router-dom"

function MoveCar() {
    const imageIp = "http://192.168.4.1/jpg"


    useEffect(() => {
        const imgUpdate=setInterval(()=>{ loadImage()},500)
        return ()=>{
            clearInterval(imgUpdate)
        }
    }, []);
    
    const toMove=(direct)=>{
        fetch(`http://192.168.4.1/${direct}`)
            .then((response) => console.log("response:", response))
            .catch((error) => console.log("error:", error));
    }

    const loadImage = () => {
        const img_output = document.getElementById('img-output');
        toDataURL(imageIp, function (dataUrl) {
            img_output.src = dataUrl
        })
        return img_output
    }
    const toDataURL=(url, callback)=> {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const onSetFileClassifier = (clas) => {
  
        switch(clas){
            case 'w': toMove('w'); break;
            case 'a': toMove('a'); break;
            case 'd': toMove('d'); break;
            default: toMove('s'); break;
        }        
    }

    return (
        <div className={styles.container}>

            <img id="img-output" className={styles.video} width="300" height="300" crossOrigin="anonymous" />

            <div>
                <Button type="button" className={styles.button} onClick={() => {onSetFileClassifier('w')}} variant="primary">▲</Button>
            </div>
            <div>
                <Button type="button" className={styles.button} onClick={() => {onSetFileClassifier('a')}} variant="primary">◀</Button>
                <Button type="button" className={styles.button} onClick={() => {onSetFileClassifier('d')}} variant="primary">▶</Button>
            </div>
            <div>
                <Button type="button" className={styles.button} onClick={() => {onSetFileClassifier('s')}} variant="primary">▼</Button>
            </div>
            <div>
                <Link to="/">
                    <Button type="button" className={styles.home_button} variant="primary">
                        <div>홈으로</div>
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default MoveCar;
