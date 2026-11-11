#!/usr/bin/env python3
"""
FLAMES Calculator CLI
A beautiful terminal-based FLAMES calculator with step-by-step visual elimination.
Usage:
  python3 flames.py
  python3 flames.py "Romeo" "Juliet"
"""

import sys
import time

# ANSI color codes
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
MAGENTA = "\033[95m"
CYAN = "\033[96m"
WHITE = "\033[97m"

FLAMES_DATA = {
    'F': {
        'word': 'Friends',
        'emoji': '🤝',
        'tagline': 'Best Friends for Life',
        'desc': 'Unbreakable trust, shared laughs, and rock-solid camaraderie.',
        'color': CYAN,
        'score': 89
    },
    'L': {
        'word': 'Love',
        'emoji': '💖',
        'tagline': 'Passionate Lovers',
        'desc': 'Electric chemistry and true romantic resonance.',
        'color': MAGENTA,
        'score': 98
    },
    'A': {
        'word': 'Affection',
        'emoji': '🥰',
        'tagline': 'Deep Warmth & Caring',
        'desc': 'Gentle tenderness and a comforting sanctuary for each other.',
        'color': YELLOW,
        'score': 93
    },
    'M': {
        'word': 'Marriage',
        'emoji': '💍',
        'tagline': 'Happily Ever After',
        'desc': 'Lifelong teamwork, shared dreams, and cosmic harmony.',
        'color': GREEN,
        'score': 99
    },
    'E': {
        'word': 'Enemies',
        'emoji': '⚔️',
        'tagline': 'Fierce Rivals / Enemies-to-Lovers',
        'desc': 'High friction, fiery passion, and relentless banter.',
        'color': RED,
        'score': 54
    },
    'S': {
        'word': 'Siblings',
        'emoji': '👫',
        'tagline': 'Sibling Energy',
        'desc': 'Stealing snacks and endless teasing, but always having each other’s backs.',
        'color': BLUE,
        'score': 84
    },
    '✨': {
        'word': 'Soulmates',
        'emoji': '✨',
        'tagline': 'Cosmic Twin Resonance',
        'desc': 'Zero difference! Two reflections of the exact same soul.',
        'color': YELLOW,
        'score': 100
    }
}


def clean_name(name: str) -> list[str]:
    return [c.lower() for c in name if c.isalpha()]


def calculate_flames(name1: str, name2: str):
    chars1 = clean_name(name1)
    chars2 = clean_name(name2)

    list1 = list(chars1)
    list2 = list(chars2)

    matched_pairs = []
    i = 0
    while i < len(list1):
        c = list1[i]
        if c in list2:
            list1.remove(c)
            list2.remove(c)
            matched_pairs.append(c)
        else:
            i += 1

    rem1 = list1
    rem2 = list2
    remaining_count = len(rem1) + len(rem2)

    print(f"\n{BOLD}{CYAN}=== 1. LETTER CANCELLATION ==={RESET}")
    print(f"Name 1: {BOLD}{name1}{RESET} -> Remaining: [{', '.join(rem1) or 'None'}] ({len(rem1)})")
    print(f"Name 2: {BOLD}{name2}{RESET} -> Remaining: [{', '.join(rem2) or 'None'}] ({len(rem2)})")
    print(f"Matched letters cancelled: [{', '.join(matched_pairs) or 'None'}] ({len(matched_pairs) * 2} letters)")
    print(f"{BOLD}Magic Count (N): {YELLOW}{remaining_count}{RESET} ({len(rem1)} + {len(rem2)})\n")

    if remaining_count == 0:
        return '✨', remaining_count

    print(f"{BOLD}{MAGENTA}=== 2. CIRCULAR ELIMINATION ==={RESET}")
    flames = ['F', 'L', 'A', 'M', 'E', 'S']
    start_idx = 0

    for round_num in range(1, 6):
        elim_idx = (start_idx + remaining_count - 1) % len(flames)
        elim_letter = flames[elim_idx]
        
        # Display animation line
        traversal = []
        for step in range(len(flames)):
            ch = flames[step]
            if step == elim_idx:
                traversal.append(f"{RED}[{ch} ✗]{RESET}")
            else:
                traversal.append(f"{BOLD}{WHITE}{ch}{RESET}")

        print(f"Round {round_num}: {' '.join(traversal)} -> Eliminated: {RED}{BOLD}{elim_letter}{RESET} ({FLAMES_DATA[elim_letter]['word']})")

        flames.pop(elim_idx)
        start_idx = elim_idx % len(flames)
        time.sleep(0.3)

    final_letter = flames[0]
    return final_letter, remaining_count


def display_result(name1: str, name2: str, result_key: str, count: int):
    data = FLAMES_DATA[result_key]
    color = data['color']

    print(f"\n{BOLD}{color}{'=' * 56}")
    print(f"       ✨ FLAMES DESTINY RESULT ✨")
    print(f"{'=' * 56}{RESET}")
    print(f" {BOLD}{name1}{RESET}  +  {BOLD}{name2}{RESET}")
    print(f" Magic Count: {YELLOW}{count}{RESET}")
    print(f"\n Outcome: {data['emoji']}  {BOLD}{color}{data['word'].upper()}{RESET} ({data['tagline']})")
    print(f" Compatibility: {GREEN}{BOLD}{data['score']}%{RESET}")
    print(f"\n Profile: {data['desc']}")
    print(f"{color}{'=' * 56}{RESET}\n")


def main():
    print(f"{BOLD}{MAGENTA}")
    print(r"""
  ______ _        QUICK FLAMES CALCULATOR       
 |  ____| |        /\   |  \/  |  ____|/ ____|  
 | |__  | |       /  \  | \  / | |__  | (___    
 |  __| | |      / /\ \ | |\/| |  __|  \___ \   
 | |    | |____ / ____ \| |  | | |____ ____) |  
 |_|    |______/_/    \_\_|  |_|______|_____/   
""")
    print(f"{RESET}")

    if len(sys.argv) >= 3:
        name1 = sys.argv[1]
        name2 = sys.argv[2]
    else:
        try:
            name1 = input(f"{BOLD}Enter Person 1's name:{RESET} ").strip()
            name2 = input(f"{BOLD}Enter Person 2's name:{RESET} ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nExiting.")
            sys.exit(0)

    if not clean_name(name1) or not clean_name(name2):
        print(f"{RED}Error: Both names must contain letters.{RESET}")
        sys.exit(1)

    result_key, count = calculate_flames(name1, name2)
    display_result(name1, name2, result_key, count)


if __name__ == "__main__":
    main()
