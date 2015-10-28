'use strict';
/**
 * AngularJS capitalize filter for sentences or words.
 *
 * Author: egilkh <egilkh@gmail.com>
 * Language adaptation: dpacosta <danieldepaulaa@gmail.com>
 * LICENSE: MIT
 *
 */

/* globals angular: true */

angular.module('ehFilters', [])
    .filter('capitalize', function () {

      var small = '(a|de|em|por|per|o|a|os|as|um|uma|uns|umas|ao|à|aos|às|do|da|dos|das|' +
          'dum|duma|duns|dumas|no|na|nos|nas|num|numa|nuns|numas|pelo|pelos|pela|pelas|a|' +
          'ante|após|até|com|de|em|para|per|por|sem|sob|trás|e|nem|que|mas|que|ou|ora|nem|' +
          'já|logo|que|se|pois|daí|v[.]?|via|vs[.]?)';
      var punct = '([!\'#$%&\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)';

      var upper = function (str) {
        return str.substr(0,1).toUpperCase() + str.substr(1);
      };

      var lower = function (str) {
        return str.toLowerCase();
      };

      var upperFunc = function (all) {
        return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
      };

      var punctFunc = function (all, punct, word) {
        return punct + upper(word);
      };

      var firstLetterIndex = function(str) {
        var index = 0;
        var chars = str.split('');

        for (var i = 0; i < chars.length; i++) {
          var lc = chars[i].toLowerCase();
          var uc = chars[i].toUpperCase();

          // This is probably not correct for all languages.
          if (lc != uc) {
            index = i;
            break;
          }
        }

        return index;
      };

      return function (input, format) {

        format = format || 'first';
        input = input || '';

        if (format === 'first') {
          return upper(input.substring(0, 1)) + input.substring(1);
        } else if (format === 'all') {
          input = lower(input);

          var words = input.split(' ');
          words.forEach(function (word, i) {

            // Find first letter in the word.
            var index = firstLetterIndex(word),

                prefix = word.substring(0, index),
                letter = word.substring(index > 0 ? prefix.length + 1: 0, 1),
                suffix = word.substring(index + 1);

            words[i] = prefix + letter.toUpperCase() + suffix;
          });

          return words.join(' ');
        } else if (format === 'firstChar') {
          input = lower(input);
          return upper(input.substring(0, 1)) + input.substring(1);
        } else if (format === 'none') {
          // Just return the lowercased input.
          return lower(input);
        } else if (format === 'title') {
          input = lower(input);
          /*
           * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
           * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
           * License: http://www.opensource.org/licenses/mit-license.php
           */
          var parts = [],
              split = /[:.;?!] |(?: |^)["Ò]/g,
              index = 0;

          while (true) {
            var m = split.exec(input);

            parts.push(
                input.substring(index, m ? m.index : input.length)
                    .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, upperFunc)
                    .replace(new RegExp('\\b' + small + '\\b', 'ig'), lower)
                    .replace(new RegExp('^' + punct + small + '\\b', 'ig'), punctFunc)
                    .replace(new RegExp('\\b' + small + punct + '$', 'ig'), upper)
            );

            index = split.lastIndex;

            if (m) {
              parts.push(m[0]);
            } else {
              break;
            }
          }

          return parts.join('').replace(/ V(s?)\. /ig, ' v$1. ')
              .replace(/(['Õ])S\b/ig, '$1s')
              .replace(/õE/,"õe")
              .replace(/ãO/,"ão")
              .replace(/ãE/,"ãe")
              .replace(/\b(AT&T|Q&A)\b/ig, function(all){
                return all.toUpperCase();
              });
        } else {
          throw new Error('Format is unknown.');
        }

      };
    });
