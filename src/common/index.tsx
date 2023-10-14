import Carrot from "@/components/icons/Carrot";
import Car from "@/components/icons/Car";
import Dress from "@/components/icons/Dress";

export const CategoryIcon: any = {
  car: <Car fontSize="inherit" color="inherit" />,
  dress: <Dress fontSize="inherit" color="inherit" />,
  default: <Carrot fontSize="inherit" color="inherit" />,
};

// mime type images
/**
 * Load the mime type based on the signature of the first bytes of the file
 * @param  {File}   file        A instance of File
 * @param  {Function} callback  Callback with the result
 * @author Victor www.vitim.us
 * @date   2017-03-23
 */
export function loadMime(file: any, callback: any) {
  //List of known mimes
  var mimes = [
    {
      mime: "image/jpeg",
      pattern: [0xff, 0xd8, 0xff],
      mask: [0xff, 0xff, 0xff],
    },
    {
      mime: "image/png",
      pattern: [0x89, 0x50, 0x4e, 0x47],
      mask: [0xff, 0xff, 0xff, 0xff],
    },
    // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
  ];

  function check(bytes: any, mime: any) {
    for (var i = 0, l = mime.mask.length; i < l; ++i) {
      if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
        return false;
      }
    }
    return true;
  }

  var blob = file.slice(0, 4); //read the first 4 bytes of the file

  var reader = new FileReader();
  reader.onloadend = function (e: any) {
    if (e.target.readyState === FileReader.DONE) {
      var bytes = new Uint8Array(e.target.result);

      for (var i = 0, l = mimes.length; i < l; ++i) {
        if (check(bytes, mimes[i]))
          return callback(
            "Mime: " + mimes[i].mime + " <br> Browser:" + file.type
          );
      }

      return callback("Mime: unknown <br> Browser:" + file.type);
    }
  };
  reader.readAsArrayBuffer(blob);
}
