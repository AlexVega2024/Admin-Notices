type ImageProps = {
  urlImage: string;
};

export const ImageComponent = ({urlImage}: ImageProps) => {
  return (
    <div>
      <img
        src={urlImage}
        style={{
          width: 150,
          objectFit: "scale-down"
        }}
        className={`
              m-auto
              rounded 
              img-fluid
              `}
        alt={'Logo'}
      />
    </div>
  );
};
