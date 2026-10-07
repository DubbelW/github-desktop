# Setting Up Development Dependencies on Linux

You will need to install these tools on your machine:

 - Node.js
 - Yarn
 - Python 3
 - Electron dependencies

## Node.js

The NodeJS project has instructions for installing across a variety of
distributions and package managers.

Find your distribution on [this list](https://nodejs.org/en/download/package-manager/)
and follow the instructions to install the version you require.

Ensure that you also choose the option for building native Node modules, as
those are used in some dependencies used in GitHub Desktop.

## Yarn

Follow [this guide](https://yarnpkg.com/en/docs/install) to install
a system-level `yarn` for your distribution. GitHub Desktop uses a local version
of `yarn`, but it needs a version on your `PATH` to bootstrap itself.

This is important because `yarn` uses lock files to pin dependencies. If you
find yourself changing packages, this will prevent mismatches in versions
between machines.

If you're not familiar with `yarn`, please read [this document](./working-with-packages.md)
to help familiarize yourself with how to do the common package tasks that are
relevant to Desktop.

## Python 3

Refer to your distributions package manager to obtain the latest version of the
Python 3 series.

## Electron dependencies

There are some additional dependencies which are required as part of building
and running GitHub Desktop locally:

 - `libsecret` for reading and writing credentials using [`keytar`](https://github.com/atom/node-keytar)
   through the Secret Service API (GNOME Keyring, KWallet, KeePassXC, …)
 - `rpmbuild` (optional) for creating `.rpm` packages

Where to find these will vary based on your distribution, but below are some
examples of distributions we've tested.

### Fedora

```shellsession
$ sudo dnf install -y libsecret-devel rpm-build
```

### Ubuntu / Debian

```shellsession
$ sudo apt install libsecret-1-dev rpm
```

## Packaging

`yarn build:prod && yarn package` creates the following packages in `dist/`:

 - `github-desktop-<version>-amd64.deb`
 - `github-desktop-<version>-x86_64.rpm` (only when `rpmbuild` is available)
 - `github-desktop-<version>-x86_64.AppImage`

Set `DESKTOP_LINUX_TARGETS` to a comma separated list (e.g. `deb,AppImage`) to
only build some of them. The `.deb` and `.rpm` packages install a desktop entry
which registers GitHub Desktop as the handler for its `x-github-client://` and
sign-in URLs, so signing in through the browser requires one of them to be
installed (or the AppImage to be integrated with your desktop).

The `github` command line tool is included in the packages at
`resources/app/static/github.sh` inside the install directory, link it into
your `PATH` to use it:

```shellsession
$ sudo ln -s "/opt/GitHub Desktop/resources/app/static/github.sh" /usr/local/bin/github
```

## Wayland

GitHub Desktop runs as a native Wayland application when started in a Wayland
session, and falls back to X11 otherwise. Window decorations are drawn by the
app itself (using your GTK theme), and input methods such as IBus and Fcitx are
supported through the `text-input-v3` protocol.

To force GitHub Desktop to run through XWayland instead, start it with:

```shellsession
$ github-desktop --ozone-platform=x11
```

## Back to setup

Once you've installed the necessary dependencies, head back to the [setup page](https://github.com/desktop/desktop/blob/development/docs/contributing/setup.md) to finish getting set up.
