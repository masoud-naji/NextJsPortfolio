import React, { useEffect, useState, useMemo } from "react";
// import "react-datepicker/dist/react-datepicker.css";
import Head from "next/head";
import MaxImage from "next/image";
import { Card, Grid, Box } from "theme-ui";
import ReactCompareImage from "react-compare-image";
import { useDropzone } from "react-dropzone";
import Resizer from "react-image-file-resizer";
import { Form, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import backgroundImage from "../../public/Images/documents.webp";
import ButtonMn from "../../lib/Button/ButtonMn";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 10,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

// const formatArry = [
//   ".jpg",
//   ".jpeg",
//   ".png",
//   ".gif",
//   ".bmp",
//   ".svg",
//   ".tiff",
//   ".tif",
//   ".webp",
//   ".ico",
//   ".raw",
//   ".psd",
//   ".ai",
//   ".eps",
//   ".pdf",
//   ".raw",
//   ".arw",
// ];

const CompareImage = () => {
  const [File1, setFile1] = useState("");
  const [File2, setFile2] = useState("");
  const [errorDataFile1, setErrorDataFile1] = useState("");
  const [errorDataFile2, setErrorDataFile2] = useState("");
  const [Orientation, setOrientation] = useState(false);
  const [aspectRatio, setaspectRatio] = useState("wider");
  const [File1path, setFile1path] = useState("");
  const [File2path, setFile2path] = useState("");
  ///resizer config
  const [Loading, setLoading] = useState(false);
  const [ExportbtnEnable, setExportbtnEnable] = useState(true);
  const [ConverttbtnEnable, setConvertbtnEnable] = useState(true);
  const [maxWidth, setMaxWidth] = useState(300);
  const [maxHeight, setMaxHeight] = useState(300);
  const [compressFormat, setCompressFormat] = useState("WEBP");
  const [quality, setQuality] = useState(100);
  const [rotation, setRotation] = useState(0);

  const [ImprtImgH1, setImprtImgH1] = useState(0);
  const [ImprtImgW1, setImprtImgW1] = useState(0);

  const [ImprtImgH2, setImprtImgH2] = useState(0);
  const [ImprtImgW2, setImprtImgW2] = useState(0);

  const [estSize, setestSize] = useState(0);

  /////////////////////////drag and drop file upload/////////////////////////////

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fileChangeHandler(File1path);
    }, 500);
    return () => {
      setLoading(false);
      clearTimeout(timeoutId);
    };
  }, [
    rotation,
    quality,
    compressFormat,
    maxWidth,
    maxHeight,
    ExportbtnEnable,
    fileChangeHandler,
    File1path,
  ]);

  ////Left side
  const {
    getRootProps: getRootPropsFile1,
    getInputProps: getInputPropsFile1,
    isFocused: isFocusedFile1,
    isDragAccept: isDragAcceptFile1,
    isDragReject: isDragRejectFile1,
  } = useDropzone({
    onDrop: (acceptedFile) => {
      showFile1(acceptedFile[0]);
    },
    accept: "image/*",
  });

  const stylefile1 = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocusedFile1 ? focusedStyle : {}),
      ...(isDragAcceptFile1 ? acceptStyle : {}),
      ...(isDragRejectFile1 ? rejectStyle : {}),
    }),
    [isFocusedFile1, isDragAcceptFile1, isDragRejectFile1]
  );

  const showFile1 = (image) => {
    const reader = new FileReader();
    setFile1path(image);
    reader.onloadend = () => {
      const Imageresult = reader.result;

      if (!Imageresult.length) {
        setErrorDataFile1("**Not valid Image file!**");
        setFile1("");
        return;
      }
      try {
        setFile1(Imageresult);
        setConvertbtnEnable(false);
      } catch (error) {
        setErrorDataFile1("**Not valid Image file!**");
        setFile1("");
        return;
      }
    };
    reader.readAsDataURL(image);
  };
  ////Right side
  const {
    getRootProps: getRootPropsFile2,
    getInputProps: getInputPropsFile2,
    isFocused: isFocusedFile2,
    isDragAccept: isDragAcceptFile2,
    isDragReject: isDragRejectFile2,
  } = useDropzone({
    onDrop: (acceptedFile) => {
      showFile2(acceptedFile[0]);
    },
    accept: "image/*",
  });

  const stylefile2 = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocusedFile2 ? focusedStyle : {}),
      ...(isDragAcceptFile2 ? acceptStyle : {}),
      ...(isDragRejectFile2 ? rejectStyle : {}),
    }),
    [isFocusedFile2, isDragAcceptFile2, isDragRejectFile2]
  );

  const showFile2 = (image) => {
    setFile2path(image);
    const reader = new FileReader();
    reader.onloadend = () => {
      const Imageresult = reader.result;

      if (!Imageresult.length) {
        setErrorDataFile2("**Not valid Image file!**");
        setFile2("");
        return;
      }
      try {
        setFile2(Imageresult);
      } catch (error) {
        setErrorDataFile2("**Not valid Image file!**");
        setFile2("");
        return;
      }
    };
    reader.readAsDataURL(image);
  };

  const dateFile1path =
    File1path && new Date(File1path.lastModified).toString().slice(0, 15);
  // console.log(dateFile1path);
  const dateFile2path =
    File2path && new Date(File2path.lastModified).toString().slice(0, 15);
  // console.log(dateFile2path);

  ////////////////////////// Convert Image to base64 ///////////////////////////////

  const sizemaker = (imagesize) => {
    let result = Math.round(imagesize / 10) / 100;
    if (result > 1024) {
      result = Math.round((result / 1024) * 100) / 100 + " MB";
    } else {
      result = result + " KB";
    }

    return result;
  };

  const fileChangeHandler = (File1path) => {
    if (File1path) {
      try {
        setLoading(true);
        Resizer.imageFileResizer(
          File1path,
          maxWidth,
          maxHeight,
          compressFormat,
          quality,
          rotation,
          (uri) => {
            setFile2(uri);

            //method 1
            let base64Length = uri.length - (uri.indexOf(",") + 1);
            let padding =
              uri.charAt(uri.length - 2) === "="
                ? 2
                : uri.charAt(uri.length - 1) === "="
                ? 1
                : 0;
            let fileSize = base64Length * 0.75 - padding;

            // method 2
            // let base64lenght = uri.split(",")[1].split("=")[0].length;
            // let fileSize = base64lenght - (base64lenght / 8) * 2;
            setestSize(fileSize);
          },
          "base64",
          200,
          200
        );
      } catch (error) {
        console.log(error);
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  ////////////////////////////test download//////////////////////////////

  function downloadImage(src) {
    const lastDot = File1path.path.lastIndexOf(".");
    const fileName = File1path.path.substring(0, lastDot);
    const img = new Image();
    img.crossOrigin = "anonymous"; // This tells the browser to request cross-origin access when trying to download the image data.
    // ref: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#Implementing_the_save_feature
    img.src = src;
    img.onload = () => {
      // create Canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // create a tag
      const a = document.createElement("a");
      a.download = `${fileName}.${compressFormat}`;
      a.href = canvas.toDataURL(`${fileName}.${compressFormat}`);
      a.click();
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      <Head>
        <title>Convert and Compare Images</title>
        <meta
          name="description"
          content="Use this handy webp converter to resize you images from one format to another."
        />
        <meta name="description" content="jpg to Webp converter" />
        <meta name="description" content="png to Webp converter" />
        <meta
          name="description"
          content="Convert images from one format to another with the powerful image converter in this free image tool."
        />
        <meta
          name="description"
          content="Convert images and resize them in webp format with this handy online tool."
        />
        <meta
          name="description"
          content="This application helps you to compare two images and find the best match."
        />
      </Head>

      <Card
        sx={{
          color: "primary",
          display: "flex",
          flexDirection: "column",
          minHeight: "82vh",
          variant: "layout.root",
        }}
      >
        <Grid columns={[2, "2fr 1fr"]} gap={2}>
          <Box>
            <h1>Image Compare & Convert</h1>
            <h4>
              Open and compare two images and find the best match. Convert
              images and resize them in webp , jpg , png format with this handy
              online tool.
            </h4>
          </Box>
          <Box></Box>
        </Grid>

        <Card
          sx={{
            width: "100%",
            height: "10rem",
            borderRadius: ".6rem",
            margin: "1rem 0",
            padding: 0,
          }}
        >
          <MaxImage
            src={backgroundImage}
            alt="Latest Crypto Fear & Greed Index"
            height="340"
            width="2000"
          />
        </Card>

        <hr />

        <Grid columns={[1, "2fr 2fr"]} gap={2}>
          <Box>
            <Card
              sx={{
                color: "primary",
                minHeight: ["5rem", "5rem"],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  background: "primary",
                  minHeight: "14rem",
                  aspectRatio: "16/7",
                  borderRadius: "1rem",
                }}
                {...getRootPropsFile1({ stylefile1 })}
              >
                <input {...getInputPropsFile1()} />
                <Box
                  sx={{
                    maxWidth: "90%",
                    minWidth: "fit-content",
                    margin: "1rem auto",
                    color: "secondary",
                  }}
                >
                  For converting or compare Drag `&apos;`n`&apos;` drop first
                  file here
                  <br />, or click to select files
                </Box>
                <div
                  className="container"
                  style={{ overflow: "hidden", maxWidth: "80%" }}
                >
                  <p>Only Images Accepted</p>
                </div>
                {errorDataFile1 ? (
                  errorDataFile1
                ) : File1path ? (
                  <ul>
                    <li>Name: {File1path.path}</li>
                    <li>Size: {sizemaker(File1path.size)}</li>
                    {/* <li>last Modified Date: {dateFile1path}</li> */}
                    <li>Height :{ImprtImgW1}</li>
                    <li>Width : {ImprtImgH1}</li>
                    <li>
                      <img
                        src={File1}
                        alt=""
                        onLoad={({ target: img }) => {
                          const { offsetHeight, offsetWidth } = img;
                          setImprtImgH1(offsetHeight);
                          setImprtImgW1(offsetWidth);
                          setMaxHeight(offsetHeight);
                          setMaxWidth(offsetWidth);
                          console.log(offsetHeight, offsetWidth);
                        }}
                        style={{
                          position: "absolute",
                          marginLeft: "-10000px",
                        }}
                      />
                    </li>
                  </ul>
                ) : null}
              </Box>
            </Card>
          </Box>
          <Box>
            <Card
              sx={{
                color: "primary",
                minHeight: ["5rem", "5rem"],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {ConverttbtnEnable ? (
                <Box
                  sx={{
                    background: "primary",
                    minHeight: "14rem",
                    aspectRatio: "16/7",
                    borderRadius: "1rem",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "90%",
                      minWidth: "fit-content",
                      margin: "1rem auto",
                      color: "secondary",
                    }}
                  >
                    For Comparing two Images you have to add the first image
                    section
                    <br />
                    at the left side.
                  </Box>
                  <div
                    className="container"
                    style={{ overflow: "hidden", maxWidth: "80%" }}
                  >
                    <p>🚫Add first file first</p>
                  </div>
                </Box>
              ) : (
                <Box
                  sx={{
                    background: "primary",
                    minHeight: "14rem",
                    aspectRatio: "16/7",
                    borderRadius: "1rem",
                  }}
                  {...getRootPropsFile2({ stylefile2 })}
                >
                  <input {...getInputPropsFile2()} />
                  <Box
                    sx={{
                      maxWidth: "90%",
                      minWidth: "fit-content",
                      margin: "1rem auto",
                      color: "secondary",
                    }}
                  >
                    For compare Drag `&apos;`n`&apos;` drop second file here ,
                    or click to select files
                  </Box>
                  <div
                    className="container"
                    style={{ overflow: "hidden", maxWidth: "80%" }}
                  >
                    <p>Only Images Accepted</p>
                  </div>
                  {errorDataFile2 ? (
                    errorDataFile2
                  ) : File2path ? (
                    <ul>
                      <li>Name: {File2path.path}</li>
                      <li>Size: {sizemaker(File2path.size)}</li>
                      {/* <li>last Modified Date: {File2path.size}</li> */}
                      <li>Height :{ImprtImgW2}</li>
                      <li>Width : {ImprtImgH2}</li>
                      <li>
                        <img
                          src={File2}
                          alt=""
                          onLoad={({ target: img }) => {
                            const { offsetHeight, offsetWidth } = img;
                            setImprtImgH2(offsetHeight);
                            setImprtImgW2(offsetWidth);
                            console.log(offsetHeight, offsetWidth);
                          }}
                          style={{
                            position: "absolute",
                            marginLeft: "-10000px",
                          }}
                        />
                      </li>
                    </ul>
                  ) : null}
                </Box>
              )}
            </Card>
          </Box>
        </Grid>

        <Card>
          <Grid
            gap={2}
            columns={[1, 2, 4]}
            sx={{
              paddingTop: "0",
              minHeight: "5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Box>
              <ButtonMn onClick={() => setOrientation(!Orientation)}>
                Orintation - {Orientation ? "Vertical" : "Horizontal"}
              </ButtonMn>
            </Box>
            <Box>
              <ButtonMn
                onClick={() =>
                  setaspectRatio(aspectRatio === "wider" ? "taller" : "wider")
                }
              >
                AspectRatio -
                {aspectRatio === "wider" ? "Vertical" : "Horizontal"}
              </ButtonMn>
            </Box>
            <Box>
              <ButtonMn
                disabled={ConverttbtnEnable}
                onClick={() => {
                  setFile2(File1);
                  setExportbtnEnable(false);
                }}
              >
                {ConverttbtnEnable ? " 🚫 " : " ✅ "}
                Convert Image
              </ButtonMn>
            </Box>
            <Box>
              <ButtonMn
                onClick={() => {
                  downloadImage(File2);
                }}
                disabled={ExportbtnEnable}
              >
                {ExportbtnEnable ? " 🚫 " : " ✅ "}
                Export Image <br />
              </ButtonMn>
            </Box>
          </Grid>
        </Card>
      </Card>

      <div className="ImageEditor">
        <section style={{ display: "grid" }}>
          <label>Width:&nbsp;&nbsp;</label>
          <input
            value={maxWidth}
            id="maxWidth"
            type="number"
            placeholder="Max Width..."
            onChange={(e) => {
              setMaxWidth(e.target.value);
              // fileChangeHandler(File1path);
            }}
          />
        </section>
        <section style={{ display: "grid" }}>
          <label>Height:&nbsp;</label>
          <input
            value={maxHeight}
            id="maxHeight"
            type="number"
            placeholder="Max Height.."
            onChange={(e) => {
              setMaxHeight(e.target.value);
              // fileChangeHandler(File1path);
            }}
          />
        </section>
        <section style={{ display: "grid" }}>
          <label>Format:&nbsp;</label>
          <select
            name="compressFormat"
            id="compressFormat"
            onChange={(e) => {
              setCompressFormat(e.target.value);
              // fileChangeHandler(File1path);
            }}
          >
            <option value="WEBP">webp</option>
            <option value="JPEG">jpeg</option>
            <option value="PNG">png</option>
          </select>
        </section>
        <label>Quality:{quality}</label>
        <Form.Range
          id="quality"
          variant="secondary"
          min={1}
          max={100}
          step={1}
          onChange={(e) => {
            setQuality(e.target.value);
            // fileChangeHandler(File1path);
          }}
        />
        <label>Rotation:{rotation}</label>
        <Form.Range
          id="rotation"
          variant="secondary"
          min={0}
          max={360}
          step={1}
          onChange={(e) => {
            setRotation(e.target.value);
            // fileChangeHandler(File1path);
          }}
        />
        <hr />
        <label>
          Estimated size:
          {Loading ? (
            <>
              &nbsp; <Spinner animation="border" size="sm" />
            </>
          ) : estSize ? (
            sizemaker(estSize)
          ) : (
            "0"
          )}
        </label>
      </div>

      {/* ////////////////////////////  Image //////////////////////////////// */}
      <Card className="input topchartdetail">
        <ReactCompareImage
          leftImage={File1}
          rightImage={File2}
          vertical={Orientation}
          aspectRatio={aspectRatio}
        />
      </Card>
    </motion.div>
  );
};

export default CompareImage;