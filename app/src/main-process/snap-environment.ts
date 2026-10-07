/** Suffix VS Code's snap uses to preserve the original environment */
const SnapOriginalSuffix = '_VSCODE_SNAP_ORIG'

/**
 * Remove the runtime environment of a snap packaged application which has
 * leaked into ours, e.g. when we're launched from the integrated terminal of
 * Visual Studio Code installed from the Snap Store.
 *
 * Snaps point GTK, GIO and GSettings at libraries and schemas inside the snap
 * and GTK loading those (most notably GSETTINGS_SCHEMA_DIR and XDG_DATA_DIRS)
 * crashes Electron during startup on Wayland. They also leak into all
 * processes we spawn ourselves (git, editors, shells).
 *
 * Must be called before the app is ready (i.e. before GTK is initialized).
 *
 * @param env      The environment to clean up, modified in place
 * @param execPath The path of our own executable, nothing is changed if we're
 *                 running from inside the snap ourselves
 */
export function removeLeakedSnapEnvironment(
  env: NodeJS.ProcessEnv,
  execPath: string
) {
  const snapPaths = [env.SNAP, env.SNAP_USER_DATA, env.SNAP_USER_COMMON].filter(
    (p): p is string => p !== undefined && p.length > 0
  )

  if (env.SNAP === undefined || snapPaths.some(p => execPath.startsWith(p))) {
    return
  }

  // VS Code preserves the values it overrides, restore them first.
  for (const key of Object.keys(env)) {
    if (key.endsWith(SnapOriginalSuffix)) {
      const name = key.slice(0, -SnapOriginalSuffix.length)
      const original = env[key]

      if (original !== undefined && original.length > 0) {
        env[name] = original
      } else {
        delete env[name]
      }
      delete env[key]
    }
  }

  for (const [key, value] of Object.entries(env)) {
    // PATH commonly contains /snap/bin which is fine and needs to stay intact.
    if (key === 'PATH' || value === undefined) {
      continue
    }

    if (
      key === 'SNAP' ||
      key.startsWith('SNAP_') ||
      snapPaths.some(p => value.includes(p))
    ) {
      delete env[key]
    }
  }
}
