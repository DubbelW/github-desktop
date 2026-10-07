import { describe, it } from 'node:test'
import assert from 'node:assert'
import { removeLeakedSnapEnvironment } from '../../../src/main-process/snap-environment'

const execPath = '/opt/GitHub Desktop/github-desktop'

const vscodeSnapEnvironment = () => ({
  HOME: '/home/user',
  PATH: '/usr/local/bin:/usr/bin:/snap/bin',
  WAYLAND_DISPLAY: 'wayland-0',
  SNAP: '/snap/code/259',
  SNAP_NAME: 'code',
  SNAP_REVISION: '259',
  SNAP_USER_DATA: '/home/user/snap/code/259',
  SNAP_USER_COMMON: '/home/user/snap/code/common',
  GTK_PATH: '/snap/code/259/usr/lib/x86_64-linux-gnu/gtk-3.0',
  GSETTINGS_SCHEMA_DIR:
    '/home/user/snap/code/259/.local/share/glib-2.0/schemas',
  GIO_MODULE_DIR: '/home/user/snap/code/common/.cache/gio-modules',
  XDG_DATA_HOME: '/home/user/snap/code/259/.local/share',
  XDG_DATA_DIRS:
    '/home/user/snap/code/259/.local/share:/snap/code/259/usr/share:/usr/share',
  XDG_DATA_DIRS_VSCODE_SNAP_ORIG: '/usr/local/share:/usr/share',
  XDG_CONFIG_DIRS: '/snap/code/259/etc/xdg:/etc/xdg',
  XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG: '',
})

describe('removeLeakedSnapEnvironment', () => {
  it('restores the environment VS Code preserved', () => {
    const env: NodeJS.ProcessEnv = vscodeSnapEnvironment()
    removeLeakedSnapEnvironment(env, execPath)

    assert.equal(env.XDG_DATA_DIRS, '/usr/local/share:/usr/share')
    assert.equal(env.XDG_CONFIG_DIRS, undefined)
    assert.equal(env.XDG_DATA_DIRS_VSCODE_SNAP_ORIG, undefined)
    assert.equal(env.XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG, undefined)
  })

  it('removes variables pointing into the snap', () => {
    const env: NodeJS.ProcessEnv = vscodeSnapEnvironment()
    removeLeakedSnapEnvironment(env, execPath)

    assert.deepEqual(env, {
      HOME: '/home/user',
      PATH: '/usr/local/bin:/usr/bin:/snap/bin',
      WAYLAND_DISPLAY: 'wayland-0',
      XDG_DATA_DIRS: '/usr/local/share:/usr/share',
    })
  })

  it('does nothing when not launched from a snap', () => {
    const env: NodeJS.ProcessEnv = {
      HOME: '/home/user',
      XDG_DATA_HOME: '/home/user/.local/share',
    }
    removeLeakedSnapEnvironment(env, execPath)

    assert.deepEqual(env, {
      HOME: '/home/user',
      XDG_DATA_HOME: '/home/user/.local/share',
    })
  })

  it('does nothing when running from inside the snap', () => {
    const env: NodeJS.ProcessEnv = vscodeSnapEnvironment()
    removeLeakedSnapEnvironment(env, '/snap/code/259/usr/share/code/code')

    assert.deepEqual(env, vscodeSnapEnvironment())
  })
})
