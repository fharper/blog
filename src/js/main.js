//talks.js

function $$(expr, con) {
    return Array.prototype.slice.call((con || document).querySelectorAll(expr));
}

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(event) {
    var date = new Date(event.date);
    var month = MONTHS[date.getMonth()];
    var day = date.getUTCDate();

    return [day, month, date.getFullYear()].join(' ');
}

if (!('appendChildren' in Element)) {
    Element.prototype.appendChildren = function (elements) {
        var fragment = document.createDocumentFragment();

        for (var i = 0, el; el = elements[i++];) {
            if (typeof el == 'string') {
                el = document.createTextNode(el);
            }

            fragment.appendChild(el);
        }

        this.appendChild(fragment);

        return this;
    }
}

function element(tag, content, attributes) {
    var element = document.createElement(tag);

    if (content) {
        if (typeof content == 'string') {
            element.innerHTML = content;
        }
        else if (content.length > 0) {
            element.appendChildren(content);
        }
        else {
            element.appendChild(content);
        }
    }

    if (attributes) {
        for (var attr in attributes) {
            element.setAttribute(attr, attributes[attr]);
        }
    }

    return element;
}

function eventLink(type, url, h2) {
    if (typeof url == "string") {
        h2.appendChild(element('a', type.slice(0,1).toUpperCase() + type.slice(1), {
            href: url,
            "class": type,
            target: "_blank"
        }));
    }
    else if (url && url.length > 0) {
        for (var i=0, el; el=url[i++];) {
            eventLink(type, el, h2);
        }
    }
}

function eventTemplate(event) {
    var div = document.createElement('div');
    div.className = "talk";

    //Event name + presentation title
    div.innerHTML =
    "<h3>"
        + "<a href='" + event.url + "' target='_blank'>"
        + event.name
        + "</a>"
        + "</br>"
        + event.title
    + "</h3>";

    //Slides
    if (event.slides) {
        div.innerHTML += "<a href='" + event.slides + "'>"
            + "SLIDES"
            + "</a>&nbsp;&nbsp;&nbsp;&nbsp;";
    }

    //Recording
    if (event.video) {
        div.innerHTML += "<a href='" + event.video + "'>"
            + "VIDEO"
            + "</a>";
    }

    //Details
    if (event.details) {
        div.innerHTML += "<a href='" + event.details + "'>"
            + "DETAILS"
            + "</a>";
    }

    //Extra infos
    var pre = document.createElement("pre");

    //Date & city/country
    pre.innerHTML =
        formatDate(event).toUpperCase()
        + " | "
        + (event.city ? event.city.toUpperCase() : "ONLINE");

    //Comment
    if (event.comment) {
        pre.innerHTML += " | " + event.comment.toUpperCase();
    }

    //End extra info
    div.appendChild(pre);

    return div;

        /*
    var li = document.createElement('li');

    event.sessions = event.sessions || [{
        title: event.title,
        type: event.type,
        slides: event.slides,
        details: event.details,
        video: event.video,
        paper: event.paper
    }];


    //Feedback
    if (event.feedback) {
        li.appendChild(element('p',
            element("a", "Feedback", {
                href: event.feedback,
                target: "_blank"
            }),
            {
                "class": "comment"
            }
        ));
    }

    return li;*/
}


$$('.talks').forEach(function (list) {
    var file = list.getAttribute('data-source') || 'talks.json',
        xhr = new XMLHttpRequest();

    xhr.open('GET', file, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status < 400) {
                try {
                    var events = JSON.parse(xhr.responseText);
                }
                catch (e) {
                    list.innerHTML = 'Error parsing JSON file';
                    window.console && console.error(e);
                }

                var fragmentPast = [];
                var fragmentUpcoming = document.createDocumentFragment();

                var count = {
                    total: 0,
                    past: 0, upcoming: 0, types: {}
                };

                var cities = [];
                var countries = [];
                var years = {};

                events.forEach(function(event) {
                    if (!event.date) {
                        return;
                    }

                    var template = eventTemplate(event);
                    var time = new Date(event.date), now = new Date();

                    if (time > now) {
                        fragmentUpcoming.appendChild(template);
                        count.upcoming++;
                    }
                    else {
                        //Count talks by years
                        var year = time.getFullYear();
                        if (years[year]) {
                            years[year]++;
                        }
                        else {
                            fragmentPast[year] = document.createDocumentFragment();
                            years[year] = 1;
                        }

                        fragmentPast[year].appendChild(template);
                        count.past++;
                    }

                    count.total++;

                    var type = event.type.toLowerCase();
                    count.types[type] = count.types[type] + 1 || 1;

                    if (!cities.includes(event.city))
                        cities.push(event.city);

                    if (!countries.includes(event.country))
                        countries.push(event.country);
                });

                if (count.past) {

                    /*
                    for (var year in years) {
                        console.log("YEARS: " + year.toString() + " _ " + years[year]);
                    }
                    */

                   for (var year in fragmentPast) {
                        var listPast = list.cloneNode();
                        var h1Past = element("h2", year, { id: "past" });
                        list.parentNode.insertBefore(h1Past, list.nextSibling);

                        list.parentNode.insertBefore(element('p', "" + years[year] + " events"), list.nextSibling.nextSibling);

                        list.parentNode.insertBefore(listPast, list.nextSibling.nextSibling.nextSibling);
                        //h1Past.appendChild(element('span', " (" + countries.length + " countries)", { "class": "count" }));

                        listPast.appendChild(fragmentPast[year]);
                    }
                }

                var h1Upcoming = element("h2", "Upcoming", { id: "upcoming" });
                list.parentNode.insertBefore(h1Upcoming, list);
                if (count.upcoming) {
                    list.parentNode.insertBefore(element('p', "" + count.upcoming + " events"), list);
                    list.appendChild(fragmentUpcoming);
                }
                else {
                    h1Upcoming.appendChild(element('span', " (no event)", { "class": "count" }));
                    list.appendChild(element('p', "More speaking gigs coming soon, stay tuned!"));
                }

                h1Upcoming.parentNode.insertBefore(element('p', "I gave " +  count.past + " talks in " + cities.length + " different cities from " + countries.length + " unique countries.", {"class": "events"}), h1Upcoming);

            }
            else {
                list.innerHTML = 'Error loading file (' + xhr.status + ' ' + xhr.statusText + ')';
            }
        }
    };

    xhr.send(null);
});