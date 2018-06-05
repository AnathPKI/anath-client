angular.module('anath')

    .factory('DownloadService', function () {

        return {
            /** Download a text file with a given filename and text coneten **/
            downloadTextFile: function (content, filename) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            },

            /** Download a binary file with given filename and blob content **/
            downloadBlob: function (blob, filename) {
                var element = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                element.setAttribute('href', url);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.setAttribute('download', filename);
                element.click();

                document.body.removeChild(element);
            }
        }
    });