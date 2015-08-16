var file_url = process.argv[2],
    utils = require('./lib/utils');

if (/^https?:/.test(file_url)) {
  utils.downloadFile(file_url, function (err, file) {
    if (err) {
      console.error(err);
    } else {
      processDriver(file['path']);
    }
  });
} else if (/\.zip$/.test(file_url)) {
  processDriver(file_url);
} else {
  utils.readFile(file_url, checkINFFile);
}

function processDriver(file_name) {
  var dir_name;
  utils.unzipFile(file_name);
  dir_name =  file_name.replace(/\.zip$/, '')
  utils.findFile(dir_name, /\.inf$/, function (err, inf_file) {
     if (err) {
       console.error(err);
     } else {
       utils.readFile(inf_file, checkINFFile);
     }
  });
}

function checkINFFile(err, data) {
  var os_versions, output;
  if (err) {
    console.error(err);
  } else {
    os_versions = utils.parseOS(data.toString());
    if (os_versions) {
      output = utils.formatOutput(os_versions);
      console.log(output);
    } else {
      console.error('OS versions are not found in the INF file');
    }
  }
}
