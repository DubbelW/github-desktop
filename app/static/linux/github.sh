#!/bin/sh

CONTENTS="$(dirname "$(dirname "$(dirname "$(dirname "$(realpath "$0")")")")")"

if [ -x "$CONTENTS/github-desktop" ]; then
	ELECTRON="$CONTENTS/github-desktop"
else
	ELECTRON="$CONTENTS/github-desktop-dev"
fi

CLI="$CONTENTS/resources/app/cli.js"

ELECTRON_RUN_AS_NODE=1 "$ELECTRON" "$CLI" "$@"

exit $?
