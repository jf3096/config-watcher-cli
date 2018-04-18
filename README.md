# config-watcher-cli

a tool used to watch config file and react when the config file has been changed.

## Installation

```shell
  npm i config-watcher-cli -g
```

## How to use

Open your command line or shell and key in,

`config-watcher-cli -s <source of your images> -d <destination of your images>`

```
    Usage: index [options]
  
    Options:
  
      -V, --version         output the version number
      -c, --config <value>  config file path
      -C, --cmd <value>     if any changes from config file can trigger current cmd
      -h, --help            output usage information
```

## Example

common case, lets say if we need to watch the shadowsocks.json. If any changes applies to it, it will restart the shadowsocks:

`config-watcher-cli -c "/etc/shadowsocks.json" -C "ssserver -c /etc/shadowsocks.json -d restart"`

## Author
Ailun She
