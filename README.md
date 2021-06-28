Custom Discord nicknames (browser userscript)
=============================================

What's this for?
----------------

If you find yourself struggling to remember who someone is on Discord
from their username, and you use Discord in a standard desktop browser
supported by [Tampermonkey](https://www.tampermonkey.net/), then this
is for you.

(Unfortunately this won't probably work on Discord apps or mobile
browsers.)

Background
----------

One of Discord's most infuriating features is that when any of your
contacts have chosen cryptic usernames (nicknames), you basically have
to remember which username corresponds to which person.

Currently the only help Discord provides on this front is the "notes"
feature, where you can click on a user's nickname, and then click to
add a note reminding you who that user actually is.

[Countless requests](https://support.discord.com/hc/en-us/search?filter_by=community&query=custom+nicknames&utf8=%E2%9C%93)
have been made for a feature where you can (privately) assign your own
choice of name to any other user, including [some with many
upvotes](https://support.discord.com/hc/en-us/community/posts/360058761331-Client-Side-Nicknames-Nicknames-for-your-friends-).
But sadly these *seem* to have fallen on deaf ears for quite a while,
so we've mostly just had to tolerate this annoyance.

I say "mostly", because it seems [they are potentially working on some
kind of solution to
this](https://support.discord.com/hc/en-us/community/posts/1500000932002/comments/1500000829422)
but supposedly it's currently exclusive to people with access to the
experimental mode, and unless you already have that, trying to get it
is supposedly [against the
ToS](https://www.reddit.com/r/discordapp/comments/jhor2x/how_does_one_get_experimental_features/).
So unless you know a way around this, like me you were stuck with the
issue ...

Until now!

How it works
------------

After installation, you configure this userscript with a mapping which
translates nicknames of Discord users you know into their real names
(or whatever display text you want to represent them).

Then it basically watches the Discord web page for certain HTML
elements which it knows will represent user's nicknames, and if any of
those match any of the nicknames in the mapping you've configured,
they will be automatically replaced with the alternative text you've
chosen.

Installation
------------

First ensure you have [Tampermonkey](https://www.tampermonkey.net/)
installed.  This script might also work with similar alternatives like
[Violentmonkey](https://violentmonkey.github.io/) or
[Greasemonkey](https://www.greasespot.net/), but I haven't tested
those yet.  (If you can help with that, please see issues
[#4](https://github.com/aspiers/Discord-custom-nicks-userscript/issues/4)
and
[#5](https://github.com/aspiers/Discord-custom-nicks-userscript/issues/5).)

Then just [click
here](https://raw.githubusercontent.com/aspiers/Discord-custom-nicks-userscript/main/Discord-custom-nicks.user.js)
and it should offer you the option to install the userscript.

Configuration
-------------

- Visit https://discord.com

- Click on the Tampermonkey icon near the top-right of your browser.

- If installation succeeded, you should see a `Discord custom
  nicknames` userscript active.

- Click on `Nickname mapping`.  You'll see this:

![image](https://user-images.githubusercontent.com/100738/123567203-7f530180-d7b9-11eb-85a4-91ae227d68f9.png)

- Follow the instructions to enter one or more mappings for Discord
  users you know who have hard-to-remember nicknames.

- Click the `Save` button.

That's it!  You should now see those nicknames automatically replaced
with the more sensible text you have chosen.

FAQ
---

### Does this compromise the privacy of users?

No!  The mapping is stored locally in your browser, and is only used
client-side and never sent over any network.  Don't take my word for
it; you can check the source code, and/or use the network analysis
tools in browser development consoles to verify this.

### Will this become redundant if Discord implements this feature natively?

Possibly, but only if they do it in a completely privacy-preserving
way.  If they don't and you use their feature, you are potentially
[doxing](https://en.wikipedia.org/wiki/Doxing) any users for whom
you assign real names.

### How can I share my configuration across multiple browsers / machines?

For now you probably just have to copy and paste, but [suggestions for
how to improve this are very welcome](https://github.com/aspiers/Discord-custom-nicks-userscript/issues/1).
However ideally they should preserve user privacy, i.e. not disclose
unencrypted mappings over the network to third parties like cloud
service providers.

Development / support / feedback
--------------------------------

Please see [the `CONTRIBUTING.md` file](CONTRIBUTING.md).

Copyright license
-----------------

See [the `COPYING` file](COPYING).
