import { useRef } from "react"
import CanvasDraw from "react-canvas-draw";

function resizedataURL(datas, wantedWidth, wantedHeight) {
  return new Promise(async function (resolve, reject) {

    // We create an image to receive the Data URI
    var img = document.createElement('img');

    // When the event "onload" is triggered we can resize the image.
    img.onload = function () {
      // We create a canvas and get its context.
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');

      // We set the dimensions at the wanted size.
      canvas.width = wantedWidth;
      canvas.height = wantedHeight;

      // We resize the image with the canvas method drawImage();
      ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

      var dataURI = canvas.toDataURL();

      // This is the return of the Promise
      resolve(dataURI);
    };

    // We put the Data URI in the image's src attribute
    img.src = datas;

  })
}// Use it like : var newDataURI = await resizedataURL('yourDataURIHere', 50, 50);

var BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function WritingCanvas({ setImage }) {
  const canvasRef = useRef(null);

  return (
    <CanvasDraw
      ref={canvasRef}
      onChange={(e) => {

        // console.log(canvasRef.current.canvasContainer.childNodes)
        var canvas = canvasRef.current.canvasContainer.childNodes[1]
        // var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        console.log(context.getImageData(0, 0, 28, 28).data)


        // var computedStyle = getComputedStyle(document.getElementById('paint'));
        var computedStyle = getComputedStyle(canvasRef.current.canvasContainer.parentElement)
        canvas.width = parseInt(computedStyle.getPropertyValue('width'));
        canvas.height = parseInt(computedStyle.getPropertyValue('height'));
        var img = new Image();
        img.onload = function () {
          context.drawImage(img, 0, 0, 28, 28);
          data = context.getImageData(0, 0, 28, 28).data;
          var input = [];
          for (var i = 0; i < data.length; i += 4) {
            input.push(data[i + 2] / 255);
            console.log(data[i + 2] / 255)
          }
          // predict(input);
        };
        img.src = canvas.toDataURL('image/png');

        var imag = canvasRef.current.canvasContainer.childNodes[1].toDataURL()
        // console.log(imag)
        // resizedataURL(imag, 28, 28).then(function (src) {
        //   console.log(src)
        // })

        var img = new Image()
        canvasRef.current.drawImage(img, 0, 0, 28, 28);
        var data = canvasRef.current.ctx.drawing.getImageData(0, 0, 28, 28).data;
        // console.log(data.length)

        resizedataURL(imag, 28, 28).then(function (data) {
          // console.log("resized image: ", data)
          // var input = [];
          var asd = convertDataURIToBinary(data)
          // console.log(asd)

          // console.log("input: ", input)

          // setImage(input)
        })

        // var input = [];
        // for (var i = 0; i < data.length; i += 4) {
        //   // input.push(data[i + 2] / 255);
        //   var mean = (data[i] + data[i + 1] + data[i + 2] + data[i + 3]) / 4
        //   input.push(mean)
        // }
        // // console.log("input: ", input)
        // for (var j = 0; j < input.length; j++) {
        //   console.log(input[j])
        // }
        // setImage(input)
      }}
      canvasWidth="100%"
      canvasHeight="100%"
      // saveData="asd.png"
      style={{
        boxShadow:
          "0 13px 27px -5px rgba(50, 50, 93, 0.25),    0 8px 16px -8px rgba(0, 0, 0, 0.3)",
        // height: "100%",
        // width: "100%",
      }}
    />
  );
}

export default WritingCanvas;
