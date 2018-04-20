# config-watcher-cli

a tool used to watch config file and react when the config file has been impact (add, delete or change).

## Installation

```shell
  npm i config-watcher-cli -g
```

## How to use

Open your command line or shell and key in `config-watcher`:

```
    Usage: index [options]
  
    Options:
  
      -V, --version             output the version number
      -c, --config <value>      config file path
      -C, --cmd <value>         if any changes from config file can trigger current cmd
      -w, --watch-mode [value]  watch file mode [add, change, unlink], default: add and change
      -h, --help                output usage information
```

### watch-mode

Listen for an FS event. Available events: add, change, unlink. default is add and change if no set.

## Example

common case, lets say if we need to watch the shadowsocks.json. If any changes applies to it, it will restart the shadowsocks:

`config-watcher -c "/etc/shadowsocks.json" -C "ssserver -c /etc/shadowsocks.json -d restart"`

with specific watch mode, react whenever delete target file:

`config-watcher -c "/etc/shadowsocks.json" -C "ssserver -c /etc/shadowsocks.json -d restart" -w "unlink"` 

## Author
Ailun She
