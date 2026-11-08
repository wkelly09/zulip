"use strict";

const assert = require("node:assert/strict");

const {clock, mock_esm, set_global, zrequire} = require("./lib/namespace.cjs");
const {run_test} = require("./lib/test.cjs");
const {$} = require("./lib/zjquery.cjs");

set_global("document", "document-stub");

const message_lists = mock_esm("../src/message_lists", {current: undefined});
const message_viewport = mock_esm("../src/message_viewport");
mock_esm("../src/inbox_util", {is_visible: () => false});

const {Filter} = zrequire("filter");
const message_scroll = zrequire("message_scroll");

function set_view(terms, {at_bottom = true, found_newest = true, empty = false} = {}) {
    message_lists.current = {
        visibly_empty: () => empty,
        data: {
            filter: new Filter(terms),
            fetch_status: {has_found_newest: () => found_newest},
        },
    };
    message_viewport.bottom_rendered_message_visible = () => at_bottom;
}

const topic_terms = [
    {operator: "channel", operand: "1"},
    {operator: "topic", operand: "navigation"},
];
const dm_terms = [{operator: "dm", operand: [2, 3]}];

run_test("at_end_of_topic_or_dm_conversation", () => {
    for (const terms of [topic_terms, dm_terms]) {
        set_view(terms);
        assert.equal(message_scroll.is_at_end_of_conversation(), true);

        set_view(terms, {at_bottom: false});
        assert.equal(message_scroll.is_at_end_of_conversation(), false);

        set_view(terms, {found_newest: false});
        assert.equal(message_scroll.is_at_end_of_conversation(), false);

        set_view(terms, {empty: true});
        assert.equal(message_scroll.is_at_end_of_conversation(), false);
    }
});

run_test("other_message_views_are_not_conversations", () => {
    for (const terms of [
        [],
        [{operator: "channel", operand: "1"}],
        [{operator: "is", operand: "dm"}],
        [...topic_terms, {operator: "search", operand: "hello"}],
        [...dm_terms, {operator: "sender", operand: 2}],
    ]) {
        set_view(terms);
        assert.equal(message_scroll.is_at_end_of_conversation(), false);
    }
});

run_test("no_current_message_list", () => {
    message_lists.current = undefined;
    assert.equal(message_scroll.is_at_end_of_conversation(), false);
});

run_test("button_icon_and_tooltip_follow_the_current_view", () => {
    const $container = $("#scroll-to-bottom-button-container");
    const $icon = $("#scroll-to-bottom-button .zulip-icon");
    const $tooltip_target = $("#scroll-to-bottom-button-clickable-area");

    set_view(topic_terms, {at_bottom: false});
    message_scroll.show_scroll_to_bottom_button();
    assert.ok($container.hasClass("show"));
    assert.ok($icon.hasClass("zulip-icon-chevron-down"));
    assert.ok(!$icon.hasClass("zulip-icon-chevron-right"));
    assert.equal(
        $tooltip_target.attr("data-tooltip-template-id"),
        "scroll-to-bottom-button-tooltip-template",
    );

    $container.set_matches(":hover", false);
    message_scroll.hide_scroll_to_bottom();
    set_view(topic_terms);
    message_scroll.hide_scroll_to_bottom();
    assert.ok($container.hasClass("show"));
    assert.ok($icon.hasClass("zulip-icon-chevron-right"));
    assert.ok(!$icon.hasClass("zulip-icon-chevron-down"));
    assert.equal(
        $tooltip_target.attr("data-tooltip-template-id"),
        "next-unread-topic-button-tooltip-template",
    );

    clock.tick(6000);
    assert.ok($container.hasClass("show"));

    set_view(dm_terms);
    message_scroll.hide_scroll_to_bottom();
    assert.ok($container.hasClass("show"));
    assert.ok($icon.hasClass("zulip-icon-chevron-right"));
    assert.equal(
        $tooltip_target.attr("data-tooltip-template-id"),
        "next-unread-dm-button-tooltip-template",
    );

    set_view(dm_terms, {at_bottom: false});
    message_scroll.show_scroll_to_bottom_button();
    assert.ok($icon.hasClass("zulip-icon-chevron-down"));
    assert.ok(!$icon.hasClass("zulip-icon-chevron-right"));
    assert.equal(
        $tooltip_target.attr("data-tooltip-template-id"),
        "scroll-to-bottom-button-tooltip-template",
    );
});

run_test("changing_the_action_destroys_the_previous_tooltip", ({override}) => {
    const $tooltip_target = $("#scroll-to-bottom-button-clickable-area");
    $tooltip_target.attr("data-tooltip-template-id", "scroll-to-bottom-button-tooltip-template");
    let destroyed = 0;
    override($tooltip_target[0], "_tippy", {
        destroy() {
            destroyed += 1;
        },
    });

    set_view(topic_terms);
    message_scroll.show_scroll_to_bottom_button();
    assert.equal(destroyed, 1);
    message_scroll.hide_scroll_to_bottom();
    assert.equal(destroyed, 1);

    set_view(dm_terms);
    message_scroll.show_scroll_to_bottom_button();
    assert.equal(destroyed, 2);
});

run_test("button_is_hidden_at_the_end_of_other_views", () => {
    const $container = $("#scroll-to-bottom-button-container");
    for (const terms of [[], [{operator: "channel", operand: "1"}]]) {
        set_view(terms);
        $container.addClass("show");
        message_scroll.hide_scroll_to_bottom();
        assert.ok(!$container.hasClass("show"));
        message_scroll.show_scroll_to_bottom_button();
        assert.ok(!$container.hasClass("show"));
    }

    set_view(topic_terms, {empty: true});
    $container.addClass("show");
    message_scroll.hide_scroll_to_bottom();
    assert.ok(!$container.hasClass("show"));

    message_lists.current = undefined;
    $container.addClass("show");
    message_scroll.hide_scroll_to_bottom();
    assert.ok(!$container.hasClass("show"));
});
