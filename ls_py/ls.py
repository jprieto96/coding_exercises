import argparse
import os

def list_directory(list_all: False, more_details: False):
    if not list_all and not more_details:
        dirs = os.listdir()
        for file in dirs:
            print(file)
    elif not list_all:
        pass
    else:
        pass

def cli() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog = 'ls',
        description = 'List information about the file(s) in the current directory by default.'
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        '-a', '--all',
        action = 'store_true',
        help = 'do not ignore entries starting with .',

    )
    group.add_argument(
        '-l', '--more',
        action = 'store_true',
        help = 'Show more information about file or directory',

    )

    return parser.parse_args()

def main():
    args = cli()
    list_directory(args.all, args.more)

if __name__ == '__main__':
    main()