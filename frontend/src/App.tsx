import React, { useEffect, useState } from "react";

import { Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// import WritingCanvas from "./components/WritingCanvas";
import ModelPredict from "./components/ModelPredict";
import GitHub from "./components/GitHub/GitHub";

const useStyles = makeStyles((theme) => ({
  item: {
    border: "3px solid red",
    height: "83vh",
  },
  container: {
    padding: 20,
  },
  button: {
    textAlign: "center",
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    padding: 0,
    margin: 0,
  },
}));

function App() {
  const classes = useStyles();
  const [runModel] = ModelPredict();
  const [image, setImage] = useState("");

  useEffect(() => {
    if (runModel) {
      // From https://www.html5canvastutorials.com/labs/html5-canvas-paint-application/
      var canvas: any = document.getElementById("myCanvas");
      var context = canvas.getContext("2d");
      var paint: any = document.getElementById("paint");
      var compuetedStyle = getComputedStyle(paint);
      canvas.width = parseInt(compuetedStyle.getPropertyValue("width"));
      canvas.height = parseInt(compuetedStyle.getPropertyValue("height"));

      var mouse = { x: 0, y: 0 };

      var onPaint = function () {
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
      };

      // http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
      // Set up touch events for mobile, etc
      canvas.addEventListener(
        "touchstart",
        function (e: any) {
          var touch = e.touches[0];
          canvas.dispatchEvent(
            new MouseEvent("mousedown", {
              clientX: touch.clientX,
              clientY: touch.clientY,
            })
          );
        },
        false
      );
      canvas.addEventListener(
        "touchend",
        function (e: any) {
          canvas.dispatchEvent(new MouseEvent("mouseup", {}));
        },
        false
      );
      canvas.addEventListener(
        "touchmove",
        function (e: any) {
          var touch = e.touches[0];
          canvas.dispatchEvent(
            new MouseEvent("mousemove", {
              clientX: touch.clientX,
              clientY: touch.clientY,
            })
          );
        },
        false
      );

      canvas.addEventListener(
        "mousemove",
        function (e: any) {
          mouse.x = e.pageX - canvas.offsetLeft;
          mouse.y = e.pageY - canvas.offsetTop;
        },
        false
      );

      context.lineWidth = 25;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.strokeStyle = "red";

      canvas.addEventListener(
        "mousedown",
        function (e: any) {
          context.moveTo(mouse.x, mouse.y);
          context.beginPath();
          canvas.addEventListener("mousemove", onPaint, false);
        },
        false
      );

      canvas.addEventListener(
        "mouseup",
        function () {
          canvas.removeEventListener("mousemove", onPaint, false);
          var img = new Image();
          img.onload = function () {
            context.drawImage(img, 0, 0, 28, 28);
            var data = context.getImageData(0, 0, 28, 28).data;
            // for (var j = 0; j < data.length; ++j) {
            //   if (data[j] !== 0) {
            //     console.log(data[j]);
            //   }
            // }
            var input = [];
            for (var j = 0; j < data.length; j += 4) {
              var res =
                (data[j] + data[j + 1] + data[j + 2] + data[j + 3]) / 4.0;
              input.push(res / 255);
              // input.push(data[j + 2] / 255);
            }
            // Print the whole array of data
            // console.log(JSON.stringify(input, null, 1));
            if (input.every((item) => item === 0)) {
              console.error("Can't be all zeros!");
            } else {
              runModel(input, setImage);
            }
          };
          img.src = canvas.toDataURL("image/png");
        },
        false
      );
    }
  }, [runModel]);

  return (
    <Grid
      container
      className={classes.container}
      direction="row"
      justify="space-around"
      alignItems="center"
    >
      <GitHub url="https://github.com/mattborghi/mnist-webapp" />
      <Grid className={classes.title} item xs={12}>
        <h1>MNIST Number Predictor</h1>
      </Grid>
      <Grid className={classes.item} item xs={12} sm={5}>
        {/* <h2 className={classes.title}>Write here: </h2> */}
        {/* <WritingCanvas setImage={setImage} /> */}
        <div id="paint" className={classes.canvas}>
          <canvas id="myCanvas"></canvas>
        </div>
      </Grid>
      <Grid item sm={2}></Grid>
      <Grid className={classes.item} item xs={12} sm={5}>
        <div id="number" className={classes.image}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 48 1"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            style={{ caretColor: "transparent" }}
          >
            {image !== "" && (
              <text x="0" y="0" fill="black" fontSize="30%">
                Predicted:{" "}
              </text>
            )}
            <text x="30" y="5" fill="red">
              {image}
            </text>
          </svg>
        </div>
      </Grid>
      <Grid className={classes.button} item xs>
        <Button variant="outlined" onClick={() => setImage("")}>
          Clear
        </Button>
      </Grid>
    </Grid>
  );
}

export default App;
