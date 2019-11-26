import React, {useEffect, useRef} from 'react';
interface LazyImageProps {
  /**
   * 图片的真实src,不传默认显示占位图
   */
  src?: string;

  /**
   * 默认的占位图片，可以自己传，默认使用lazyImage的占位图
   */
  defaultSrc?: string;

  /**
   * 图片样式
   */
  style?: React.CSSProperties;

  /**
   * 自定义配置项
   */
  options?: IntersectionObserver
}

const defaultUrl = 'data:image/png;base64,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';

const defaultImgStyle:React.CSSProperties = {
  width: 300,
  height: 200,
  border: '1px solid #ccc'
}

const LazyImage:React.FC<LazyImageProps> = ({src= defaultUrl, style=defaultImgStyle, defaultSrc= defaultUrl, options={}}) => {
  const imgRef = useRef(null);

  const setDefaultSrc = () => {
    imgRef.current.src = defaultSrc;
  }

  const proxyImage = () => {
    const img = new Image();
    img.onload = () => {
      imgRef.current.src = src;
    }
    return {
      setSrc() {
        img.src = src;
      }
    }
  }

  
  useEffect(() => {
    setDefaultSrc(); 

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(item => {
        if (item.isIntersecting) {
          proxyImage().setSrc();
          if (src) {
            observer.unobserve(item.target);
          }
        }
      })
    }, {...options})

    observer.observe(imgRef.current);
    
    return () => {
      observer.unobserve(imgRef.current);
    }

  }, [])

  return (
    <div style={style}>
      <img ref={imgRef} src="" alt="" style={{width: '100%', height: '100%'}}/>
    </div>
  )
}

export default LazyImage;