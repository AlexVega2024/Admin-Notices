type ImageProps = {
  urlImage: string;
  typeImage: string;
  name: string;
  widthImage?: number;
  heightImage?: number;
  objectFit?: "fill" | "cover" | "scale-down";
  border?: boolean;
};

export const ImageComponent = ({urlImage, typeImage, name, widthImage=150, heightImage=150, objectFit="fill", border=false}: ImageProps) => {
  return (
    <img
      src={urlImage}
      style={{
        width: widthImage,
        height: heightImage,
        objectFit: objectFit,
        border: border ? "1px solid black" : ""
      }}
      className={`
              m-auto
              rounded 
              img-fluid
              `}
      alt={typeImage + "_" + name}
    />
  );
};
