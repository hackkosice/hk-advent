
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function once(fn) {
        let ran = false;
        return function (...args) {
            if (ran)
                return;
            ran = true;
            fn.call(this, ...args);
        };
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=M;var p=function(t){return t instanceof _},S=function(t,e,n){var r;if(!t)return D;if("string"==typeof t)v[t]&&(r=t),e&&(v[t]=e,r=t);else {var i=t.name;v[i]=t,r=i;}return !n&&r&&(D=r),r||!n&&D},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var D=this.$locale().weekStart||0,v=(y<D?y+7:y)-D;return $(r?m-v:m+(6-v),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,D=O.m(this,M);return D=(l={},l[c]=D/12,l[f]=D,l[h]=D/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?D:O.a(D)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return v[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),b=_.prototype;return w.prototype=b,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){b[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=v[D],w.Ls=v,w.p={},w}));
    });

    var utc = createCommonjsModule(function (module, exports) {
    !function(t,i){module.exports=i();}(commonjsGlobal,(function(){var t="minute",i=/[+-]\d\d(?::?\d\d)?/g,e=/([+-]|\d\d)/g;return function(s,f,n){var u=f.prototype;n.utc=function(t){var i={date:t,utc:!0,args:arguments};return new f(i)},u.utc=function(i){var e=n(this.toDate(),{locale:this.$L,utc:!0});return i?e.add(this.utcOffset(),t):e},u.local=function(){return n(this.toDate(),{locale:this.$L,utc:!1})};var o=u.parse;u.parse=function(t){t.utc&&(this.$u=!0),this.$utils().u(t.$offset)||(this.$offset=t.$offset),o.call(this,t);};var r=u.init;u.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds();}else r.call(this);};var a=u.utcOffset;u.utcOffset=function(s,f){var n=this.$utils().u;if(n(s))return this.$u?0:n(this.$offset)?a.call(this):this.$offset;if("string"==typeof s&&null===(s=function(t){void 0===t&&(t="");var s=t.match(i);if(!s)return null;var f=(""+s[0]).match(e)||["-",0,0],n=f[0],u=60*+f[1]+ +f[2];return 0===u?0:"+"===n?u:-u}(s)))return this;var u=Math.abs(s)<=16?60*s:s,o=this;if(f)return o.$offset=u,o.$u=0===s,o;if(0!==s){var r=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(o=this.local().add(u+r,t)).$offset=u,o.$x.$localOffset=r;}else o=this.utc();return o};var h=u.format;u.format=function(t){var i=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return h.call(this,i)},u.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||(new Date).getTimezoneOffset());return this.$d.valueOf()-6e4*t},u.isUTC=function(){return !!this.$u},u.toISOString=function(){return this.toDate().toISOString()},u.toString=function(){return this.toDate().toUTCString()};var l=u.toDate;u.toDate=function(t){return "s"===t&&this.$offset?n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():l.call(this)};var c=u.diff;u.diff=function(t,i,e){if(t&&this.$u===t.$u)return c.call(this,t,i,e);var s=this.local(),f=n(t).local();return c.call(s,f,i,e)};}}));
    });

    var timezone = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t={year:0,month:1,day:2,hour:3,minute:4,second:5},e={};return function(n,i,o){var r,a=function(t,n,i){void 0===i&&(i={});var o=new Date(t);return function(t,n){void 0===n&&(n={});var i=n.timeZoneName||"short",o=t+"|"+i,r=e[o];return r||(r=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",timeZoneName:i}),e[o]=r),r}(n,i).formatToParts(o)},u=function(e,n){for(var i=a(e,n),r=[],u=0;u<i.length;u+=1){var f=i[u],s=f.type,m=f.value,c=t[s];c>=0&&(r[c]=parseInt(m,10));}var d=r[3],l=24===d?0:d,v=r[0]+"-"+r[1]+"-"+r[2]+" "+l+":"+r[4]+":"+r[5]+":000",h=+e;return (o.utc(v).valueOf()-(h-=h%1e3))/6e4},f=i.prototype;f.tz=function(t,e){void 0===t&&(t=r);var n=this.utcOffset(),i=this.toDate(),a=i.toLocaleString("en-US",{timeZone:t}),u=Math.round((i-new Date(a))/1e3/60),f=o(a).$set("millisecond",this.$ms).utcOffset(15*-Math.round(i.getTimezoneOffset()/15)-u,!0);if(e){var s=f.utcOffset();f=f.add(n-s,"minute");}return f.$x.$timezone=t,f},f.offsetName=function(t){var e=this.$x.$timezone||o.tz.guess(),n=a(this.valueOf(),e,{timeZoneName:t}).find((function(t){return "timezonename"===t.type.toLowerCase()}));return n&&n.value};var s=f.startOf;f.startOf=function(t,e){if(!this.$x||!this.$x.$timezone)return s.call(this,t,e);var n=o(this.format("YYYY-MM-DD HH:mm:ss:SSS"));return s.call(n,t,e).tz(this.$x.$timezone,!0)},o.tz=function(t,e,n){var i=n&&e,a=n||e||r,f=u(+o(),a);if("string"!=typeof t)return o(t).tz(a);var s=function(t,e,n){var i=t-60*e*1e3,o=u(i,n);if(e===o)return [i,e];var r=u(i-=60*(o-e)*1e3,n);return o===r?[i,o]:[t-60*Math.min(o,r)*1e3,Math.max(o,r)]}(o.utc(t,i).valueOf(),f,a),m=s[0],c=s[1],d=o(m).utcOffset(c);return d.$x.$timezone=a,d},o.tz.guess=function(){return Intl.DateTimeFormat().resolvedOptions().timeZone},o.tz.setDefault=function(t){r=t;};}}));
    });

    var duration = createCommonjsModule(function (module, exports) {
    !function(t,s){module.exports=s();}(commonjsGlobal,(function(){var t,s,n=1e3,i=6e4,e=36e5,r=864e5,o=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,u=31536e6,h=2592e6,a=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,d={years:u,months:h,days:r,hours:e,minutes:i,seconds:n,milliseconds:1,weeks:6048e5},c=function(t){return t instanceof p},f=function(t,s,n){return new p(t,n,s.$l)},m=function(t){return s.p(t)+"s"},l=function(t){return t<0},$=function(t){return l(t)?Math.ceil(t):Math.floor(t)},y=function(t){return Math.abs(t)},g=function(t,s){return t?l(t)?{negative:!0,format:""+y(t)+s}:{negative:!1,format:""+t+s}:{negative:!1,format:""}},p=function(){function l(t,s,n){var i=this;if(this.$d={},this.$l=n,void 0===t&&(this.$ms=0,this.parseFromMilliseconds()),s)return f(t*d[m(s)],this);if("number"==typeof t)return this.$ms=t,this.parseFromMilliseconds(),this;if("object"==typeof t)return Object.keys(t).forEach((function(s){i.$d[m(s)]=t[s];})),this.calMilliseconds(),this;if("string"==typeof t){var e=t.match(a);if(e){var r=e.slice(2).map((function(t){return null!=t?Number(t):0}));return this.$d.years=r[0],this.$d.months=r[1],this.$d.weeks=r[2],this.$d.days=r[3],this.$d.hours=r[4],this.$d.minutes=r[5],this.$d.seconds=r[6],this.calMilliseconds(),this}}return this}var y=l.prototype;return y.calMilliseconds=function(){var t=this;this.$ms=Object.keys(this.$d).reduce((function(s,n){return s+(t.$d[n]||0)*d[n]}),0);},y.parseFromMilliseconds=function(){var t=this.$ms;this.$d.years=$(t/u),t%=u,this.$d.months=$(t/h),t%=h,this.$d.days=$(t/r),t%=r,this.$d.hours=$(t/e),t%=e,this.$d.minutes=$(t/i),t%=i,this.$d.seconds=$(t/n),t%=n,this.$d.milliseconds=t;},y.toISOString=function(){var t=g(this.$d.years,"Y"),s=g(this.$d.months,"M"),n=+this.$d.days||0;this.$d.weeks&&(n+=7*this.$d.weeks);var i=g(n,"D"),e=g(this.$d.hours,"H"),r=g(this.$d.minutes,"M"),o=this.$d.seconds||0;this.$d.milliseconds&&(o+=this.$d.milliseconds/1e3);var u=g(o,"S"),h=t.negative||s.negative||i.negative||e.negative||r.negative||u.negative,a=e.format||r.format||u.format?"T":"",d=(h?"-":"")+"P"+t.format+s.format+i.format+a+e.format+r.format+u.format;return "P"===d||"-P"===d?"P0D":d},y.toJSON=function(){return this.toISOString()},y.format=function(t){var n=t||"YYYY-MM-DDTHH:mm:ss",i={Y:this.$d.years,YY:s.s(this.$d.years,2,"0"),YYYY:s.s(this.$d.years,4,"0"),M:this.$d.months,MM:s.s(this.$d.months,2,"0"),D:this.$d.days,DD:s.s(this.$d.days,2,"0"),H:this.$d.hours,HH:s.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:s.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:s.s(this.$d.seconds,2,"0"),SSS:s.s(this.$d.milliseconds,3,"0")};return n.replace(o,(function(t,s){return s||String(i[t])}))},y.as=function(t){return this.$ms/d[m(t)]},y.get=function(t){var s=this.$ms,n=m(t);return "milliseconds"===n?s%=1e3:s="weeks"===n?$(s/d[n]):this.$d[n],0===s?0:s},y.add=function(t,s,n){var i;return i=s?t*d[m(s)]:c(t)?t.$ms:f(t,this).$ms,f(this.$ms+i*(n?-1:1),this)},y.subtract=function(t,s){return this.add(t,s,!0)},y.locale=function(t){var s=this.clone();return s.$l=t,s},y.clone=function(){return f(this.$ms,this)},y.humanize=function(s){return t().add(this.$ms,"ms").locale(this.$l).fromNow(!s)},y.milliseconds=function(){return this.get("milliseconds")},y.asMilliseconds=function(){return this.as("milliseconds")},y.seconds=function(){return this.get("seconds")},y.asSeconds=function(){return this.as("seconds")},y.minutes=function(){return this.get("minutes")},y.asMinutes=function(){return this.as("minutes")},y.hours=function(){return this.get("hours")},y.asHours=function(){return this.as("hours")},y.days=function(){return this.get("days")},y.asDays=function(){return this.as("days")},y.weeks=function(){return this.get("weeks")},y.asWeeks=function(){return this.as("weeks")},y.months=function(){return this.get("months")},y.asMonths=function(){return this.as("months")},y.years=function(){return this.get("years")},y.asYears=function(){return this.as("years")},l}();return function(n,i,e){t=e,s=e().$utils(),e.duration=function(t,s){var n=e.locale();return f(t,{$l:n},s)},e.isDuration=c;var r=i.prototype.add,o=i.prototype.subtract;i.prototype.add=function(t,s){return c(t)&&(t=t.asMilliseconds()),r.bind(this)(t,s)},i.prototype.subtract=function(t,s){return c(t)&&(t=t.asMilliseconds()),o.bind(this)(t,s)};}}));
    });

    // TypeIt by Alex MacArthur - https://typeitjs.com
    const defaults = [null, null, {}];
    var guaranteeThreeKeys = (q) => {
      return q.map((queueItem) => {
        return defaults.map((defaultValue, index) => {
          if (queueItem[index])
            return queueItem[index];
          return defaultValue;
        });
      });
    };
    var merge = (originalObj, newObj) => {
      return Object.assign({}, originalObj, newObj);
    };
    const Queue = function(initialItems) {
      const add = function(steps) {
        _queue = _queue.concat(guaranteeThreeKeys(steps));
        return this;
      };
      const set = function(index, item) {
        _queue[index] = item;
      };
      const reset = function() {
        _queue = _queue.map((item) => {
          item[2].executed = false;
          return item;
        });
      };
      const getItems = function() {
        return _queue.filter((i) => !i[2].executed);
      };
      const setMeta = function(index, meta) {
        _queue[index][2] = merge(_queue[index][2], meta);
      };
      let _queue = [];
      add(initialItems);
      return {
        add,
        set,
        reset,
        getItems,
        setMeta
      };
    };
    var toArray = (val) => {
      return Array.from(val);
    };
    var getParsedBody = (content) => {
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = content;
      return doc.body;
    };
    var isTypeableNode = (node) => {
      return node.nodeType === 3 || node.tagName === "BR";
    };
    const getAllTypeableNodes = (element, parentToExclude = null, shouldReverse = false) => {
      let nodes = toArray(element.childNodes).flatMap((child) => {
        return isTypeableNode(child) ? child : getAllTypeableNodes(child);
      });
      if (parentToExclude) {
        nodes = nodes.filter((n) => !parentToExclude.contains(n));
      }
      return shouldReverse ? nodes.reverse() : nodes;
    };
    const constructQueueFromNodes = (el) => {
      let nodeArray = getAllTypeableNodes(el);
      return nodeArray.flatMap((item) => {
        if (item.nodeValue) {
          return toArray(item.nodeValue).map((character) => {
            return createCharacterObject(character, item);
          });
        }
        return createCharacterObject(item);
      });
    };
    const createCharacterObject = (content, node = null) => {
      return { node, content };
    };
    function chunkStringAsHtml(string) {
      let htmlBody = getParsedBody(string);
      return constructQueueFromNodes(htmlBody);
    }
    function maybeChunkStringAsHtml(str, asHtml = true) {
      if (asHtml) {
        return chunkStringAsHtml(str);
      }
      return toArray(str).map((char) => createCharacterObject(char));
    }
    var createElement = (el) => {
      return document.createElement(el);
    };
    var createTextNode = (content) => {
      return document.createTextNode(content);
    };
    var appendStyleBlock = (styles, id = "") => {
      let styleBlock = createElement("style");
      styleBlock.id = id;
      styleBlock.appendChild(createTextNode(styles));
      document.head.appendChild(styleBlock);
    };
    var isArray = (thing) => {
      return Array.isArray(thing);
    };
    var asArray = (value) => {
      return isArray(value) ? value : [value];
    };
    const isNumber = (value) => {
      return Number.isInteger(value);
    };
    const select = (selector, element = document, all = false) => {
      return element[`querySelector${all ? "All" : ""}`](selector);
    };
    const DATA_ATTRIBUTE = "data-typeit-id";
    const CURSOR_CLASS = "ti-cursor";
    const START = "START";
    const END = "END";
    const DEFAULT_STATUSES = {
      started: false,
      completed: false,
      frozen: false,
      destroyed: false
    };
    const DEFAULT_OPTIONS = {
      breakLines: true,
      cursor: true,
      cursorChar: "|",
      cursorSpeed: 1e3,
      deleteSpeed: null,
      html: true,
      lifeLike: true,
      loop: false,
      loopDelay: 750,
      nextStringDelay: 750,
      speed: 100,
      startDelay: 250,
      startDelete: false,
      strings: [],
      waitUntilVisible: false,
      beforeString: () => {
      },
      afterString: () => {
      },
      beforeStep: () => {
      },
      afterStep: () => {
      },
      afterComplete: () => {
      }
    };
    const calculateStepsToSelector = (selector, element, to = START) => {
      let isMovingToLast = new RegExp(END, "i").test(to);
      let cursor = select(`.${CURSOR_CLASS}`, element);
      let selectedElement = selector ? select(selector, element) : element;
      let selectedElementNodes = getAllTypeableNodes(selectedElement, cursor, true);
      let selectedElementFirstChild = selectedElementNodes[0];
      let selectedElementLastChild = selectedElementNodes[selectedElementNodes.length - 1];
      let isMovingToEndOfRootElement = isMovingToLast && !selector;
      let childIndex = isMovingToEndOfRootElement ? 0 : getAllTypeableNodes(element, cursor, true).findIndex((character) => {
        return character.isSameNode(isMovingToLast ? selectedElementFirstChild : selectedElementLastChild);
      });
      if (isMovingToLast)
        childIndex--;
      return childIndex + 1;
    };
    var calculateCursorSteps = ({
      el,
      move,
      cursorPos,
      to
    }) => {
      if (isNumber(move)) {
        return move * -1;
      }
      let childIndex = calculateStepsToSelector(move, el, to);
      return childIndex - cursorPos;
    };
    var calculateDelay = (delayArg) => {
      if (!isArray(delayArg)) {
        delayArg = [delayArg / 2, delayArg / 2];
      }
      return delayArg;
    };
    var randomInRange = (value, range2) => {
      return Math.abs(Math.random() * (value + range2 - (value - range2)) + (value - range2));
    };
    let range = (val) => val / 2;
    function calculatePace(options) {
      let { speed, deleteSpeed, lifeLike } = options;
      deleteSpeed = deleteSpeed !== null ? deleteSpeed : speed / 3;
      return lifeLike ? [
        randomInRange(speed, range(speed)),
        randomInRange(deleteSpeed, range(deleteSpeed))
      ] : [speed, deleteSpeed];
    }
    var destroyTimeouts = (timeouts) => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      return [];
    };
    var generateHash = () => {
      return Math.random().toString().substring(2, 9);
    };
    var isInput = (el) => {
      return "value" in el;
    };
    const getAllChars = (element) => {
      return isInput(element) ? toArray(element.value) : getAllTypeableNodes(element, select(`.${CURSOR_CLASS}`, element), true);
    };
    var fireWhenVisible = (element, func) => {
      let observer = new IntersectionObserver((entries, observer2) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            func();
            observer2.unobserve(element);
          }
        });
      }, { threshold: 1 });
      observer.observe(element);
    };
    const handleFunctionalArg = (arg) => {
      return typeof arg === "function" ? arg() : arg;
    };
    var isBodyElement = (node) => {
      return node.tagName === "BODY";
    };
    const findPrintedNode = (node, elementToSearch) => {
      let printedNodes = toArray(select("*", elementToSearch, true));
      return [elementToSearch].concat(printedNodes.reverse()).find((i) => {
        return i.cloneNode().isEqualNode(node.cloneNode());
      });
    };
    const isLastElement = (node, nodeToIgnore) => {
      let sibling = node.nextSibling;
      return !sibling || sibling.isEqualNode(nodeToIgnore);
    };
    const insertIntoElement = (targetElement, character, cursorNode, cursorPosition) => {
      let contentIsElement = character.content instanceof HTMLElement;
      let characterNode = character.node;
      let parentNode = characterNode == null ? void 0 : characterNode.parentNode;
      let content = contentIsElement ? character.content : createTextNode(character.content);
      if (isInput(targetElement)) {
        targetElement.value = `${targetElement.value}${character.content}`;
        return;
      }
      if (!contentIsElement && parentNode && !isBodyElement(parentNode)) {
        let existingNode = findPrintedNode(parentNode, targetElement);
        if (existingNode && isLastElement(existingNode, cursorNode)) {
          targetElement = existingNode;
        } else {
          content = parentNode.cloneNode();
          content.appendChild(createTextNode(character.content));
          let genericAncestor = parentNode.parentNode;
          let genericAncestorClone = genericAncestor.cloneNode();
          if (!isBodyElement(genericAncestor)) {
            let printedAncestor = findPrintedNode(genericAncestorClone, targetElement);
            while (!printedAncestor && !isBodyElement(genericAncestor)) {
              let newContentNode = genericAncestorClone;
              newContentNode["innerHTML"] = content["outerHTML"];
              content = newContentNode;
              genericAncestor = genericAncestor.parentNode;
              genericAncestorClone = genericAncestor.cloneNode();
              printedAncestor = findPrintedNode(genericAncestorClone, targetElement);
            }
            targetElement = printedAncestor || targetElement;
          }
        }
      }
      let lastNode = getAllTypeableNodes(targetElement, cursorNode, true)[cursorPosition - 1];
      let elementToTypeInto = lastNode ? lastNode.parentNode : targetElement;
      elementToTypeInto.insertBefore(content, elementToTypeInto.contains(cursorNode) ? cursorNode : null);
    };
    const updateCursorPosition = (steps, cursorPosition, printedCharacters) => {
      return Math.min(Math.max(cursorPosition + steps, 0), printedCharacters.length);
    };
    var removeNode = (node) => {
      return node && node.remove();
    };
    var removeEmptyElements = (node, nodeToIgnore) => {
      select("*", node, true).forEach((i) => {
        if (!i.innerHTML && i.tagName !== "BR" && !i.isSameNode(nodeToIgnore)) {
          let nodeToRemove = i;
          while (nodeToRemove.parentElement.childNodes.length === 1) {
            nodeToRemove = nodeToRemove.parentElement;
          }
          removeNode(nodeToRemove);
        }
      });
    };
    var repositionCursor = (element, allChars, cursor, newCursorPosition) => {
      let nodeToInsertBefore = allChars[newCursorPosition - 1];
      element = (nodeToInsertBefore == null ? void 0 : nodeToInsertBefore.parentNode) || element;
      element.insertBefore(cursor, nodeToInsertBefore || null);
    };
    function selectorToElement(thing) {
      return typeof thing === "string" ? select(thing) : thing;
    }
    const wait = async (callback, delay, timeouts) => {
      return new Promise((resolve) => {
        const cb = async () => {
          await callback();
          resolve();
        };
        timeouts.push(setTimeout(cb, delay));
      });
    };
    const cursorFontStyles = {
      "font-family": "",
      "font-weight": "",
      "font-size": "",
      "font-style": "",
      "line-height": "",
      color: "",
      "margin-left": "-.125em",
      "margin-right": ".125em"
    };
    const setCursorStyles = (id, options, element) => {
      let rootSelector = `[${DATA_ATTRIBUTE}='${id}']`;
      let cursorSelector = `${rootSelector} .${CURSOR_CLASS}`;
      let computedStyles = getComputedStyle(element);
      let customProperties = Object.entries(cursorFontStyles).reduce((accumulator, [item, value]) => {
        return `${accumulator} ${item}: var(--ti-cursor-${item}, ${value || computedStyles[item]});`;
      }, "");
      appendStyleBlock(`@keyframes blink-${id} { 0% {opacity: 0} 49% {opacity: 0} 50% {opacity: 1} } ${cursorSelector} { display: inline; letter-spacing: -1em; ${customProperties} animation: blink-${id} ${options.cursorSpeed / 1e3}s infinite; } ${cursorSelector}.with-delay { animation-delay: 500ms; } ${cursorSelector}.disabled { animation: none; }`, id);
    };
    function TypeIt(element, options = {}) {
      const _wait = async (callback, delay, silent = false) => {
        if (_statuses.frozen) {
          await new Promise((resolve) => {
            this.unfreeze = () => {
              _statuses.frozen = false;
              resolve();
            };
          });
        }
        silent || await _opts.beforeStep(this);
        await wait(callback, delay, _timeouts);
        silent || await _opts.afterStep(this);
      };
      const _elementIsInput = () => {
        return isInput(_element);
      };
      const _getPace = (index) => {
        return calculatePace(_opts)[index];
      };
      const _getActionPace = (instant, paceIndex = 0) => {
        return instant ? _getPace(paceIndex) : 0;
      };
      const _maybeAppendPause = (opts = {}) => {
        let delay = opts["delay"];
        delay && _queue.add([[_pause, delay]]);
      };
      const _queueAndReturn = (steps, opts) => {
        _queue.add(steps);
        _maybeAppendPause(opts);
        return this;
      };
      const _getAllChars = () => {
        return getAllChars(_element);
      };
      const _generateTemporaryOptionQueueItems = (newOptions = {}) => {
        return [
          [_options, newOptions],
          [_options, _opts]
        ];
      };
      const _addSplitPause = (items) => {
        let delay = _opts.nextStringDelay;
        _queue.add([[_pause, delay[0]], ...items, [_pause, delay[1]]]);
      };
      const _setUpCursor = () => {
        if (_elementIsInput()) {
          return;
        }
        let cursor = createElement("span");
        cursor.className = CURSOR_CLASS;
        if (!_shouldRenderCursor) {
          cursor.style.visibility = "hidden";
          return cursor;
        }
        cursor.innerHTML = getParsedBody(_opts.cursorChar).innerHTML;
        return cursor;
      };
      const _attachCursor = async () => {
        !_elementIsInput() && _element.appendChild(_cursor);
        if (!_shouldRenderCursor) {
          return;
        }
        setCursorStyles(_id, _opts, _element);
      };
      const _disableCursorBlink = (shouldDisable) => {
        if (_shouldRenderCursor) {
          _cursor.classList.toggle("disabled", shouldDisable);
          _cursor.classList.toggle("with-delay", !shouldDisable);
        }
      };
      const _generateQueue = () => {
        let strings = _opts.strings.filter((string) => !!string);
        strings.forEach((string, index) => {
          let chars = maybeChunkStringAsHtml(string, _opts.html);
          _queue.add([[_type, { chars }, _freezeCursorMeta]]);
          if (index + 1 === strings.length) {
            return;
          }
          const splitPauseArgs = _opts.breakLines ? [
            [
              _type,
              {
                chars: [createCharacterObject(createElement("BR"))],
                silent: true
              },
              _freezeCursorMeta
            ]
          ] : [[_delete, { num: chars.length }, _freezeCursorMeta]];
          _addSplitPause(splitPauseArgs);
        });
      };
      const _prepLoop = async (delay) => {
        _cursorPosition && await _move({ value: _cursorPosition });
        _queue.reset();
        _queue.set(0, [_pause, delay, {}]);
        await _delete({ num: null });
      };
      const _maybePrependHardcodedStrings = (strings) => {
        let existingMarkup = _element.innerHTML;
        if (!existingMarkup) {
          return strings;
        }
        _element.innerHTML = "";
        if (_opts.startDelete) {
          chunkStringAsHtml(existingMarkup).forEach((item) => {
            insertIntoElement(_element, item, _cursor, _cursorPosition);
          });
          _addSplitPause([[_delete, { num: null }]]);
          return strings;
        }
        let hardCodedStrings = existingMarkup.trim().split(/<br(?:\s*?)(?:\/)?>/);
        return hardCodedStrings.concat(strings);
      };
      const _fire = async () => {
        _statuses.started = true;
        let queueItems = _queue.getItems();
        try {
          for (let i = 0; i < queueItems.length; i++) {
            let queueAction = queueItems[i];
            let queueActionMeta = queueAction[2];
            queueActionMeta.freezeCursor && _disableCursorBlink(true);
            await queueAction[0].call(this, queueAction[1], queueActionMeta);
            _queue.setMeta(i, { executed: true });
            _disableCursorBlink(false);
          }
          _statuses.completed = true;
          await _opts.afterComplete(this);
          if (!_opts.loop) {
            throw "";
          }
          let delay = _opts.loopDelay;
          _wait(async () => {
            await _prepLoop(delay[0]);
            _fire();
          }, delay[1]);
        } catch (e) {
        }
        return this;
      };
      const _pause = (time = 0) => {
        return _wait(() => {
        }, time);
      };
      const _move = async ({
        value,
        to = START,
        instant = false
      }) => {
        let numberOfSteps = calculateCursorSteps({
          el: _element,
          move: value,
          cursorPos: _cursorPosition,
          to
        });
        let moveCursor = () => {
          _cursorPosition = updateCursorPosition(numberOfSteps < 0 ? -1 : 1, _cursorPosition, _getAllChars());
          repositionCursor(_element, _getAllChars(), _cursor, _cursorPosition);
        };
        await _wait(async () => {
          for (let i = 0; i < Math.abs(numberOfSteps); i++) {
            instant ? moveCursor() : await _wait(moveCursor, _getPace(0));
          }
        }, _getActionPace(instant));
      };
      const _type = ({
        chars,
        instant,
        silent
      }) => {
        return _wait(async () => {
          const insert = (character) => insertIntoElement(_element, character, _cursor, _cursorPosition);
          silent || await _opts.beforeString(chars, this);
          for (let i = 0; i < chars.length; i++) {
            instant ? insert(chars[i]) : await _wait(() => {
              insert(chars[i]);
            }, _getPace(0));
          }
          silent || await _opts.afterString(chars, this);
        }, _getActionPace(instant), true);
      };
      const _options = async (opts) => {
        _opts = merge(_opts, opts);
        return;
      };
      const _empty = async () => {
        if (_elementIsInput()) {
          _element.value = "";
          return;
        }
        _getAllChars().forEach((n) => {
          removeNode(n);
        });
        return;
      };
      const _delete = async ({
        num = null,
        instant = false,
        to = START
      }) => {
        await _wait(async () => {
          let rounds = isNumber(num) ? num : calculateCursorSteps({
            el: _element,
            move: num,
            cursorPos: _cursorPosition,
            to
          });
          const deleteIt = () => {
            let allChars = _getAllChars();
            if (!allChars.length)
              return;
            if (_elementIsInput()) {
              _element.value = _element.value.slice(0, -1);
            } else {
              removeNode(allChars[_cursorPosition]);
              removeEmptyElements(_element, _cursor);
            }
          };
          for (let i = 0; i < rounds; i++) {
            instant ? deleteIt() : await _wait(deleteIt, _getPace(1));
          }
        }, _getActionPace(instant, 1));
        if (num === null && _getAllChars().length - 1 > 0) {
          await _delete({ num: null });
        }
      };
      this.break = function(actionOpts) {
        const breakCharacter = createCharacterObject(createElement("BR"));
        return _queueAndReturn([[_type, { chars: [breakCharacter], silent: true }]], actionOpts);
      };
      this.delete = function(numCharacters = null, actionOpts = {}) {
        numCharacters = handleFunctionalArg(numCharacters);
        let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
        let num = numCharacters;
        let { instant, to } = actionOpts;
        return _queueAndReturn([
          bookEndQueueItems[0],
          [_delete, { num, instant, to }, _freezeCursorMeta],
          bookEndQueueItems[1]
        ], actionOpts);
      };
      this.empty = function(actionOpts = {}) {
        return _queueAndReturn([[_empty]], actionOpts);
      };
      this.exec = function(func, actionOpts) {
        let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
        return _queueAndReturn([bookEndQueueItems[0], [func, null], bookEndQueueItems[1]], actionOpts);
      };
      this.move = function(movementArg, actionOpts = {}) {
        movementArg = handleFunctionalArg(movementArg);
        let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
        let { instant, to } = actionOpts;
        let moveArgs = {
          value: movementArg === null ? "" : movementArg,
          to,
          instant
        };
        return _queueAndReturn([
          bookEndQueueItems[0],
          [_move, moveArgs, _freezeCursorMeta],
          bookEndQueueItems[1]
        ], actionOpts);
      };
      this.options = function(opts) {
        opts = handleFunctionalArg(opts);
        return _queueAndReturn([[_options, opts]], opts);
      };
      this.pause = function(milliseconds, actionOpts = {}) {
        return _queueAndReturn([[_pause, handleFunctionalArg(milliseconds)]], actionOpts);
      };
      this.type = function(string, actionOpts = {}) {
        string = handleFunctionalArg(string);
        let bookEndQueueItems = _generateTemporaryOptionQueueItems(actionOpts);
        let chars = maybeChunkStringAsHtml(string, _opts.html);
        let { instant } = actionOpts;
        let itemsToQueue = [
          bookEndQueueItems[0],
          [_type, { chars, instant }, _freezeCursorMeta],
          bookEndQueueItems[1]
        ];
        return _queueAndReturn(itemsToQueue, actionOpts);
      };
      this.is = function(key) {
        return _statuses[key];
      };
      this.destroy = function(shouldRemoveCursor = true) {
        _timeouts = destroyTimeouts(_timeouts);
        handleFunctionalArg(shouldRemoveCursor) && removeNode(_cursor);
        _statuses.destroyed = true;
      };
      this.freeze = function() {
        _statuses.frozen = true;
      };
      this.unfreeze = function() {
      };
      this.reset = function() {
        !this.is("destroyed") && this.destroy();
        _queue.reset();
        _cursorPosition = 0;
        for (let property in _statuses) {
          _statuses[property] = false;
        }
        _element[_elementIsInput() ? "value" : "innerHTML"] = "";
        return this;
      };
      this.go = function() {
        if (_statuses.started) {
          return this;
        }
        _attachCursor();
        if (!_opts.waitUntilVisible) {
          _fire();
          return this;
        }
        fireWhenVisible(_element, _fire.bind(this));
        return this;
      };
      this.getQueue = function() {
        return _queue;
      };
      this.getOptions = function() {
        return _opts;
      };
      this.getElement = function() {
        return _element;
      };
      let _element = selectorToElement(element);
      let _timeouts = [];
      let _cursorPosition = 0;
      let _freezeCursorMeta = { freezeCursor: true };
      let _statuses = merge({}, DEFAULT_STATUSES);
      let _opts = merge(DEFAULT_OPTIONS, options);
      _opts = merge(_opts, {
        html: !_elementIsInput() && _opts.html,
        nextStringDelay: calculateDelay(_opts.nextStringDelay),
        loopDelay: calculateDelay(_opts.loopDelay)
      });
      let _id = generateHash();
      let _queue = Queue([[_pause, _opts.startDelay]]);
      _element.dataset.typeitId = _id;
      appendStyleBlock(`[${DATA_ATTRIBUTE}]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}`);
      let _shouldRenderCursor = _opts.cursor && !_elementIsInput();
      let _cursor = _setUpCursor();
      _opts.strings = _maybePrependHardcodedStrings(asArray(_opts.strings));
      if (_opts.strings.length) {
        _generateQueue();
      }
    }

    /* src/components/Countdown.svelte generated by Svelte v3.44.1 */
    const file$4 = "src/components/Countdown.svelte";

    // (57:0) {#if currentDate.isBefore(adventStartDate)}
    function create_if_block$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*textRendered*/ ctx[1]) return create_if_block_1$1;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(57:0) {#if currentDate.isBefore(adventStartDate)}",
    		ctx
    	});

    	return block;
    }

    // (62:4) {:else}
    function create_else_block$3(ctx) {
    	let main;
    	let p;
    	let t1;
    	let h2;
    	let t2;

    	const block = {
    		c: function create() {
    			main = element("main");
    			p = element("p");
    			p.textContent = "Starts in";
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(/*remainingTime*/ ctx[2]);
    			add_location(p, file$4, 63, 12, 1703);
    			attr_dev(h2, "class", "svelte-11xvtk3");
    			add_location(h2, file$4, 64, 12, 1732);
    			attr_dev(main, "class", "svelte-11xvtk3");
    			add_location(main, file$4, 62, 8, 1684);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, p);
    			append_dev(main, t1);
    			append_dev(main, h2);
    			append_dev(h2, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*remainingTime*/ 4) set_data_dev(t2, /*remainingTime*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(62:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (58:4) {#if !textRendered}
    function create_if_block_1$1(ctx) {
    	let main;
    	let h1;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			attr_dev(h1, "id", "title");
    			add_location(h1, file$4, 59, 8, 1630);
    			attr_dev(main, "class", "svelte-11xvtk3");
    			add_location(main, file$4, 58, 4, 1615);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(58:4) {#if !textRendered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let show_if = /*currentDate*/ ctx[0].isBefore(/*adventStartDate*/ ctx[3]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentDate*/ 1) show_if = /*currentDate*/ ctx[0].isBefore(/*adventStartDate*/ ctx[3]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let remainingTime;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Countdown', slots, []);
    	const dispatch = createEventDispatcher();

    	const renderWelcomeText = () => {
    		new TypeIt("#title",
    		{
    				cursor: false,
    				speed: 100,
    				deleteSpeed: 25,
    				afterComplete: () => $$invalidate(1, textRendered = true)
    			}).type("Starts").pause(1000).delete().type("Dec 1st").pause(1000).delete().type("Get ready!").pause(1000).delete().pause(1000).go();
    	};

    	dayjs_min.extend(utc);
    	dayjs_min.extend(timezone);
    	dayjs_min.extend(duration);
    	let textRendered = false;
    	let currentDate = dayjs_min();
    	let adventStartDate = dayjs_min('2021-12-01T00:00:00');

    	setInterval(
    		() => {
    			$$invalidate(0, currentDate = dayjs_min());

    			if (currentDate.isAfter(adventStartDate)) {
    				dispatch('start');
    			}
    		},
    		1000
    	);

    	onMount(() => {
    		if (window.localStorage.getItem('hasVisited') === null) {
    			renderWelcomeText();
    			window.localStorage.setItem('hasVisited', "true");
    		} else {
    			$$invalidate(1, textRendered = true);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Countdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		dayjs: dayjs_min,
    		utc,
    		timezone,
    		duration,
    		TypeIt,
    		createEventDispatcher,
    		onMount,
    		dispatch,
    		renderWelcomeText,
    		textRendered,
    		currentDate,
    		adventStartDate,
    		remainingTime
    	});

    	$$self.$inject_state = $$props => {
    		if ('textRendered' in $$props) $$invalidate(1, textRendered = $$props.textRendered);
    		if ('currentDate' in $$props) $$invalidate(0, currentDate = $$props.currentDate);
    		if ('adventStartDate' in $$props) $$invalidate(3, adventStartDate = $$props.adventStartDate);
    		if ('remainingTime' in $$props) $$invalidate(2, remainingTime = $$props.remainingTime);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentDate*/ 1) {
    			$$invalidate(2, remainingTime = dayjs_min.duration(adventStartDate.diff(currentDate)).format("DD[d] HH[h] mm[m] ss[s]"));
    		}
    	};

    	return [currentDate, textRendered, remainingTime, adventStartDate];
    }

    class Countdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Countdown",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const parseJwt = (token) => {
      var base64Url = token.split(".")[1];
      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    };

    const get = async (url, token = "") => {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await resp.json();
      return data;
    };

    const post = async (url, body = {}, token = "") => {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if(resp.status === 429) {
        throw new Error("Too many requests");
      }
      const data = await resp.json();
      return data;
    };

    const getUsers = async () => {
      const data = await get(`${"https://advent.hackkosice.com"}/api/users`);
      return data.payload;
    };

    const makeAdmin = async (id) => {
      const data = await get(
        `${"https://advent.hackkosice.com"}/api/makeAdmin/${id}`,
        window.localStorage.getItem("token")
      );
      return data;
    };

    const removeAdmin = async (id) => {
      const data = await get(
        `${"https://advent.hackkosice.com"}/api/removeAdmin/${id}`,
        window.localStorage.getItem("token")
      );
      return data;
    };

    const submitTask = async (body) => {
      const data = await post(
        `${"https://advent.hackkosice.com"}/api/task/submit`,
        body,
        window.localStorage.getItem("token")
      );
      return data;
    };

    const getTasks = async () => {
      const data = await get(
        `${"https://advent.hackkosice.com"}/api/tasks`,
        window.localStorage.getItem("token")
      );
      return data;
    };

    const getTask = async (day) => {
      const data = await get(
        `${"https://advent.hackkosice.com"}/api/task/${day}`,
        window.localStorage.getItem("token")
      );
      return data;
    };

    const makeSubmission = async (body) => {
      const data = await post(
        `${"https://advent.hackkosice.com"}/api/submission`,
        body,
        window.localStorage.getItem("token")
      );
      return data;
    };

    /* src/components/Grid.svelte generated by Svelte v3.44.1 */

    const { console: console_1 } = globals;
    const file$3 = "src/components/Grid.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (52:2) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let each_value = /*boxes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "wrapper");
    			attr_dev(div, "class", "svelte-1nxtt5g");
    			add_location(div, file$3, 52, 4, 1297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*boxes, selected*/ 3) {
    				each_value = /*boxes*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(52:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#if selected > -1}
    function create_if_block$2(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*boxes*/ ctx[0][/*selected*/ ctx[1]].title + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*boxes*/ ctx[0][/*selected*/ ctx[1]].text + "";
    	let t2;
    	let form;
    	let input0;
    	let t3;
    	let input1;
    	let t4;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			html_tag = new HtmlTag();
    			t2 = space();
    			form = element("form");
    			input0 = element("input");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Back";
    			add_location(h3, file$3, 43, 6, 969);
    			html_tag.a = t2;
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Answer");
    			add_location(input0, file$3, 46, 8, 1098);
    			attr_dev(input1, "type", "submit");
    			input1.value = "Submit";
    			add_location(input1, file$3, 47, 8, 1160);
    			attr_dev(form, "class", "svelte-1nxtt5g");
    			add_location(form, file$3, 45, 6, 1043);
    			attr_dev(button, "class", "svelte-1nxtt5g");
    			add_location(button, file$3, 49, 6, 1219);
    			attr_dev(div, "class", "task svelte-1nxtt5g");
    			add_location(div, file$3, 42, 4, 944);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			html_tag.m(raw_value, div);
    			append_dev(div, t2);
    			append_dev(div, form);
    			append_dev(form, input0);
    			set_input_value(input0, /*value*/ ctx[2]);
    			append_dev(form, t3);
    			append_dev(form, input1);
    			append_dev(div, t4);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*boxes, selected*/ 3 && t0_value !== (t0_value = /*boxes*/ ctx[0][/*selected*/ ctx[1]].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*boxes, selected*/ 3 && raw_value !== (raw_value = /*boxes*/ ctx[0][/*selected*/ ctx[1]].text + "")) html_tag.p(raw_value);

    			if (dirty & /*value*/ 4 && input0.value !== /*value*/ ctx[2]) {
    				set_input_value(input0, /*value*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(42:2) {#if selected > -1}",
    		ctx
    	});

    	return block;
    }

    // (54:6) {#each boxes as box, i}
    function create_each_block$1(ctx) {
    	let div;
    	let p;
    	let t0_value = /*box*/ ctx[8].day + "";
    	let t0;
    	let t1;
    	let div_class_value;
    	let div_data_day_value;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*i*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(p, file$3, 55, 10, 1457);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*box*/ ctx[8].done ? "box done" : "box") + " svelte-1nxtt5g"));
    			attr_dev(div, "data-day", div_data_day_value = /*box*/ ctx[8].day);
    			add_location(div, file$3, 54, 8, 1354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*boxes*/ 1 && t0_value !== (t0_value = /*box*/ ctx[8].day + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*boxes*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*box*/ ctx[8].done ? "box done" : "box") + " svelte-1nxtt5g"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*boxes*/ 1 && div_data_day_value !== (div_data_day_value = /*box*/ ctx[8].day)) {
    				attr_dev(div, "data-day", div_data_day_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(54:6) {#each boxes as box, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;

    	function select_block_type(ctx, dirty) {
    		if (/*selected*/ ctx[1] > -1) return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-1nxtt5g");
    			add_location(main, file$3, 40, 0, 911);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_block.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(main, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, []);
    	let boxes = [];
    	let selected = -1;
    	let value = "";

    	const refreshBoxes = async () => {
    		const data = await getTasks();
    		$$invalidate(0, boxes = data.payload);
    	};

    	onMount(() => refreshBoxes());

    	const handleSubmit = () => {
    		if (value.length === 0) {
    			window.alert('Answer cannot be empty');
    			return;
    		}

    		makeSubmission({ day: boxes[selected].day, answer: value }).then(data => {
    			console.log(data);

    			if (data.payload === 'correct') {
    				$$invalidate(1, selected = -1);
    				refreshBoxes();
    				return;
    			}

    			window.alert(`Answer is ${data.payload}`);
    			$$invalidate(2, value = "");
    		}).catch(e => {
    			if (e.message === "Too many requests") {
    				window.alert("You are too fast, you need to wait at least 10 seconds before next submission.");
    			}
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		value = this.value;
    		$$invalidate(2, value);
    	}

    	const click_handler = () => $$invalidate(1, selected = -1);
    	const click_handler_1 = i => $$invalidate(1, selected = i);

    	$$self.$capture_state = () => ({
    		onMount,
    		getTasks,
    		makeSubmission,
    		boxes,
    		selected,
    		value,
    		refreshBoxes,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('boxes' in $$props) $$invalidate(0, boxes = $$props.boxes);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		boxes,
    		selected,
    		value,
    		handleSubmit,
    		input0_input_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Login.svelte generated by Svelte v3.44.1 */

    const { Error: Error_1$1, Object: Object_1$1 } = globals;
    const file$2 = "src/components/Login.svelte";

    // (52:4) {:else}
    function create_else_block$1(ctx) {
    	let form;
    	let h1;
    	let t0;
    	let t1_value = (/*isSignup*/ ctx[0] ? 'up' : 'in') + "";
    	let t1;
    	let t2;
    	let label0;
    	let t4;
    	let input0;
    	let t5;
    	let label1;
    	let t7;
    	let input1;
    	let t8;
    	let input2;
    	let t9;
    	let button;
    	let t10;
    	let t11_value = (/*isSignup*/ ctx[0] ? 'in' : 'up') + "";
    	let t11;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			h1 = element("h1");
    			t0 = text("Sign ");
    			t1 = text(t1_value);
    			t2 = space();
    			label0 = element("label");
    			label0.textContent = "Username";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "Password";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			button = element("button");
    			t10 = text("Sign ");
    			t11 = text(t11_value);
    			attr_dev(h1, "class", "svelte-1khuvkx");
    			add_location(h1, file$2, 53, 12, 1763);
    			attr_dev(label0, "for", "username");
    			add_location(label0, file$2, 54, 12, 1814);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "username");
    			add_location(input0, file$2, 55, 12, 1865);
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$2, 56, 12, 1931);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "id", "password");
    			add_location(input1, file$2, 57, 12, 1982);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Submit";
    			add_location(input2, file$2, 58, 12, 2052);
    			attr_dev(button, "class", "svelte-1khuvkx");
    			add_location(button, file$2, 59, 12, 2123);
    			attr_dev(form, "action", "");
    			attr_dev(form, "class", "svelte-1khuvkx");
    			add_location(form, file$2, 52, 4, 1698);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(form, t2);
    			append_dev(form, label0);
    			append_dev(form, t4);
    			append_dev(form, input0);
    			set_input_value(input0, /*username*/ ctx[2]);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			set_input_value(input1, /*password*/ ctx[3]);
    			append_dev(form, t8);
    			append_dev(form, input2);
    			append_dev(form, t9);
    			append_dev(form, button);
    			append_dev(button, t10);
    			append_dev(button, t11);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[8]),
    					listen_dev(input2, "click", /*handleSubmit*/ ctx[5], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(form, "submit", prevent_default(submit_handler), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isSignup*/ 1 && t1_value !== (t1_value = (/*isSignup*/ ctx[0] ? 'up' : 'in') + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*username*/ 4 && input0.value !== /*username*/ ctx[2]) {
    				set_input_value(input0, /*username*/ ctx[2]);
    			}

    			if (dirty & /*password*/ 8 && input1.value !== /*password*/ ctx[3]) {
    				set_input_value(input1, /*password*/ ctx[3]);
    			}

    			if (dirty & /*isSignup*/ 1 && t11_value !== (t11_value = (/*isSignup*/ ctx[0] ? 'in' : 'up') + "")) set_data_dev(t11, t11_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(52:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {#if isLoggedIn}
    function create_if_block$1(ctx) {
    	let div;
    	let button;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let grid;
    	let current;
    	let mounted;
    	let dispose;
    	grid = new Grid({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Logout";
    			t1 = space();
    			p = element("p");
    			t2 = text(/*userUsername*/ ctx[4]);
    			t3 = space();
    			create_component(grid.$$.fragment);
    			attr_dev(button, "class", "svelte-1khuvkx");
    			add_location(button, file$2, 47, 12, 1568);
    			add_location(p, file$2, 48, 12, 1628);
    			attr_dev(div, "class", "logout svelte-1khuvkx");
    			add_location(div, file$2, 46, 8, 1535);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			mount_component(grid, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleLogout*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*userUsername*/ 16) set_data_dev(t2, /*userUsername*/ ctx[4]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			destroy_component(grid, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(46:4) {#if isLoggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoggedIn*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-1khuvkx");
    			add_location(main, file$2, 44, 0, 1499);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const submit_handler = () => {
    	
    };

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let dispatch = createEventDispatcher();
    	let isSignup = false;
    	let isLoggedIn = Object.keys(window.localStorage).includes('token');
    	let username = "";
    	let password = "";

    	let userUsername = Object.keys(window.localStorage).includes('token')
    	? parseJwt(window.localStorage.getItem('token')).username
    	: '';

    	const handleSubmit = e => {
    		if (username.length === 0 || password.length === 0) {
    			window.alert("Fields should not be empty");
    			return;
    		}

    		post(`${"https://advent.hackkosice.com"}/api/${isSignup ? 'signup' : 'signin'}`, { username, password }).then(data => {
    			if (data.status === 'ok') {
    				window.localStorage.setItem('token', data.token);
    				$$invalidate(4, userUsername = parseJwt(data.token).username);
    				$$invalidate(1, isLoggedIn = true);
    				dispatch('login', { admin: parseJwt(data.token).isAdmin });
    				return;
    			}

    			throw new Error(data.payload);
    		}).catch(e => {
    			window.alert(e.message);
    		});
    	};

    	const handleLogout = () => {
    		window.localStorage.removeItem('token');
    		$$invalidate(1, isLoggedIn = false);
    		$$invalidate(4, userUsername = "");
    		dispatch('logout');
    	};

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(2, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(3, password);
    	}

    	const click_handler = () => $$invalidate(0, isSignup = !isSignup);

    	$$self.$capture_state = () => ({
    		Grid,
    		parseJwt,
    		post,
    		createEventDispatcher,
    		dispatch,
    		isSignup,
    		isLoggedIn,
    		username,
    		password,
    		userUsername,
    		handleSubmit,
    		handleLogout
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('isSignup' in $$props) $$invalidate(0, isSignup = $$props.isSignup);
    		if ('isLoggedIn' in $$props) $$invalidate(1, isLoggedIn = $$props.isLoggedIn);
    		if ('username' in $$props) $$invalidate(2, username = $$props.username);
    		if ('password' in $$props) $$invalidate(3, password = $$props.password);
    		if ('userUsername' in $$props) $$invalidate(4, userUsername = $$props.userUsername);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isSignup,
    		isLoggedIn,
    		username,
    		password,
    		userUsername,
    		handleSubmit,
    		handleLogout,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/AdminPanel.svelte generated by Svelte v3.44.1 */

    const { Error: Error_1 } = globals;

    const file$1 = "src/components/AdminPanel.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    // (84:10) {#each users as user}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*user*/ ctx[20].id + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*user*/ ctx[20].username + "";
    	let t2;
    	let t3;
    	let td2;
    	let input;
    	let input_data_userid_value;
    	let input_checked_value;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			input = element("input");
    			t4 = space();
    			add_location(td0, file$1, 85, 14, 2027);
    			add_location(td1, file$1, 86, 14, 2060);
    			attr_dev(input, "data-userid", input_data_userid_value = /*user*/ ctx[20].id);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", "isAdmin");
    			attr_dev(input, "id", "isAdmin");
    			input.checked = input_checked_value = /*user*/ ctx[20].admin === 1;
    			add_location(input, file$1, 87, 18, 2103);
    			add_location(td2, file$1, 87, 14, 2099);
    			add_location(tr, file$1, 84, 12, 2008);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, input);
    			append_dev(tr, t4);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*handleClick*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*users*/ 16 && t0_value !== (t0_value = /*user*/ ctx[20].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*users*/ 16 && t2_value !== (t2_value = /*user*/ ctx[20].username + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*users*/ 16 && input_data_userid_value !== (input_data_userid_value = /*user*/ ctx[20].id)) {
    				attr_dev(input, "data-userid", input_data_userid_value);
    			}

    			if (dirty & /*users*/ 16 && input_checked_value !== (input_checked_value = /*user*/ ctx[20].admin === 1)) {
    				prop_dev(input, "checked", input_checked_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(84:10) {#each users as user}",
    		ctx
    	});

    	return block;
    }

    // (99:10) {#each days as day}
    function create_each_block(ctx) {
    	let option;
    	let t0_value = /*day*/ ctx[17] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*day*/ ctx[17];
    			option.value = option.__value;
    			add_location(option, file$1, 99, 12, 2538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(99:10) {#each days as day}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let button;
    	let t3;
    	let div;
    	let section0;
    	let h20;
    	let t5;
    	let table;
    	let thead;
    	let th0;
    	let t7;
    	let th1;
    	let t9;
    	let th2;
    	let t11;
    	let tbody;
    	let t12;
    	let section1;
    	let h21;
    	let t14;
    	let form;
    	let label0;
    	let t16;
    	let select;
    	let t17;
    	let label1;
    	let t19;
    	let input0;
    	let t20;
    	let label2;
    	let t22;
    	let textarea;
    	let t23;
    	let label3;
    	let t25;
    	let input1;
    	let t26;
    	let input2;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*users*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*days*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Admin panel";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Logout";
    			t3 = space();
    			div = element("div");
    			section0 = element("section");
    			h20 = element("h2");
    			h20.textContent = "Make admin";
    			t5 = space();
    			table = element("table");
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "ID";
    			t7 = space();
    			th1 = element("th");
    			th1.textContent = "Username";
    			t9 = space();
    			th2 = element("th");
    			th2.textContent = "Admin?";
    			t11 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t12 = space();
    			section1 = element("section");
    			h21 = element("h2");
    			h21.textContent = "Submit task";
    			t14 = space();
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Day";
    			t16 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t17 = space();
    			label1 = element("label");
    			label1.textContent = "Title";
    			t19 = space();
    			input0 = element("input");
    			t20 = space();
    			label2 = element("label");
    			label2.textContent = "Text";
    			t22 = space();
    			textarea = element("textarea");
    			t23 = space();
    			label3 = element("label");
    			label3.textContent = "Answer";
    			t25 = space();
    			input1 = element("input");
    			t26 = space();
    			input2 = element("input");
    			add_location(h1, file$1, 71, 2, 1690);
    			attr_dev(button, "class", "svelte-6bua66");
    			add_location(button, file$1, 72, 2, 1713);
    			add_location(h20, file$1, 75, 6, 1805);
    			add_location(th0, file$1, 78, 10, 1865);
    			add_location(th1, file$1, 79, 10, 1887);
    			add_location(th2, file$1, 80, 10, 1915);
    			add_location(thead, file$1, 77, 8, 1847);
    			add_location(tbody, file$1, 82, 8, 1956);
    			attr_dev(table, "class", "svelte-6bua66");
    			add_location(table, file$1, 76, 6, 1831);
    			attr_dev(section0, "class", "svelte-6bua66");
    			add_location(section0, file$1, 74, 4, 1789);
    			add_location(h21, file$1, 94, 6, 2334);
    			attr_dev(label0, "for", "day");
    			add_location(label0, file$1, 96, 8, 2416);
    			attr_dev(select, "id", "day");
    			if (/*selectedDay*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[11].call(select));
    			add_location(select, file$1, 97, 8, 2453);
    			attr_dev(label1, "for", "title");
    			add_location(label1, file$1, 104, 8, 2645);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "title");
    			add_location(input0, file$1, 105, 8, 2686);
    			attr_dev(label2, "for", "text");
    			add_location(label2, file$1, 106, 8, 2770);
    			attr_dev(textarea, "id", "text");
    			add_location(textarea, file$1, 107, 8, 2809);
    			attr_dev(label3, "for", "answer");
    			add_location(label3, file$1, 108, 8, 2882);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "answer");
    			add_location(input1, file$1, 109, 8, 2925);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Submit";
    			add_location(input2, file$1, 110, 8, 3011);
    			attr_dev(form, "class", "svelte-6bua66");
    			add_location(form, file$1, 95, 6, 2361);
    			attr_dev(section1, "class", "svelte-6bua66");
    			add_location(section1, file$1, 93, 4, 2318);
    			attr_dev(div, "class", "wrapper svelte-6bua66");
    			add_location(div, file$1, 73, 2, 1763);
    			attr_dev(main, "class", "svelte-6bua66");
    			add_location(main, file$1, 70, 0, 1681);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, button);
    			append_dev(main, t3);
    			append_dev(main, div);
    			append_dev(div, section0);
    			append_dev(section0, h20);
    			append_dev(section0, t5);
    			append_dev(section0, table);
    			append_dev(table, thead);
    			append_dev(thead, th0);
    			append_dev(thead, t7);
    			append_dev(thead, th1);
    			append_dev(thead, t9);
    			append_dev(thead, th2);
    			append_dev(table, t11);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tbody, null);
    			}

    			append_dev(div, t12);
    			append_dev(div, section1);
    			append_dev(section1, h21);
    			append_dev(section1, t14);
    			append_dev(section1, form);
    			append_dev(form, label0);
    			append_dev(form, t16);
    			append_dev(form, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selectedDay*/ ctx[0]);
    			append_dev(form, t17);
    			append_dev(form, label1);
    			append_dev(form, t19);
    			append_dev(form, input0);
    			set_input_value(input0, /*title*/ ctx[1]);
    			append_dev(form, t20);
    			append_dev(form, label2);
    			append_dev(form, t22);
    			append_dev(form, textarea);
    			set_input_value(textarea, /*text*/ ctx[2]);
    			append_dev(form, t23);
    			append_dev(form, label3);
    			append_dev(form, t25);
    			append_dev(form, input1);
    			set_input_value(input1, /*answer*/ ctx[3]);
    			append_dev(form, t26);
    			append_dev(form, input2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*handleLogout*/ ctx[7], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[11]),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input0, "keyup", /*handleChange*/ ctx[9], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[13]),
    					listen_dev(textarea, "keyup", /*handleChange*/ ctx[9], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    					listen_dev(input1, "keyup", /*handleChange*/ ctx[9], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[8]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*users, handleClick*/ 80) {
    				each_value_1 = /*users*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*days*/ 32) {
    				each_value = /*days*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selectedDay, days*/ 33) {
    				select_option(select, /*selectedDay*/ ctx[0]);
    			}

    			if (dirty & /*title*/ 2 && input0.value !== /*title*/ ctx[1]) {
    				set_input_value(input0, /*title*/ ctx[1]);
    			}

    			if (dirty & /*text*/ 4) {
    				set_input_value(textarea, /*text*/ ctx[2]);
    			}

    			if (dirty & /*answer*/ 8 && input1.value !== /*answer*/ ctx[3]) {
    				set_input_value(input1, /*answer*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let users;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AdminPanel', slots, []);
    	const days = [...Array(24)].map((_, i) => i + 1);
    	let selectedDay = 0;
    	let title = "";
    	let text = "";
    	let answer = "";
    	let hasInputChanged = false;
    	let dispatch = createEventDispatcher();
    	onMount(() => updateUsersList());

    	const updateUsersList = async () => {
    		$$invalidate(4, users = await getUsers());
    	};

    	const handleClick = e => {
    		const id = parseInt(e.target.dataset.userid);

    		if (e.target.checked) {
    			makeAdmin(id).then(() => updateUsersList());
    		} else {
    			removeAdmin(id).then(() => updateUsersList());
    		}
    	};

    	const handleLogout = () => {
    		window.localStorage.removeItem("token");
    		dispatch("logout");
    	};

    	const handleSubmit = () => {
    		if (selectedDay === "" || title === "" || text === "" || answer === "") {
    			window.alert("Please fill all the information");
    			return;
    		}

    		submitTask({ day: selectedDay, title, text, answer }).then(data => {
    			if (data.status === "ok") {
    				window.alert("Task submitted successfully");
    				return;
    			}

    			throw new Error(data.payload);
    		});
    	};

    	const handleChange = () => {
    		$$invalidate(10, hasInputChanged = true);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AdminPanel> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selectedDay = select_value(this);
    		$$invalidate(0, selectedDay);
    		$$invalidate(5, days);
    	}

    	function input0_input_handler() {
    		title = this.value;
    		(($$invalidate(1, title), $$invalidate(0, selectedDay)), $$invalidate(10, hasInputChanged));
    	}

    	function textarea_input_handler() {
    		text = this.value;
    		(($$invalidate(2, text), $$invalidate(0, selectedDay)), $$invalidate(10, hasInputChanged));
    	}

    	function input1_input_handler() {
    		answer = this.value;
    		(($$invalidate(3, answer), $$invalidate(0, selectedDay)), $$invalidate(10, hasInputChanged));
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		getTask,
    		getUsers,
    		makeAdmin,
    		removeAdmin,
    		submitTask,
    		days,
    		selectedDay,
    		title,
    		text,
    		answer,
    		hasInputChanged,
    		dispatch,
    		updateUsersList,
    		handleClick,
    		handleLogout,
    		handleSubmit,
    		handleChange,
    		users
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedDay' in $$props) $$invalidate(0, selectedDay = $$props.selectedDay);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    		if ('answer' in $$props) $$invalidate(3, answer = $$props.answer);
    		if ('hasInputChanged' in $$props) $$invalidate(10, hasInputChanged = $$props.hasInputChanged);
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('users' in $$props) $$invalidate(4, users = $$props.users);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedDay, hasInputChanged*/ 1025) {
    			{
    				getTask(selectedDay).then(data => {
    					if (data.payload.length) {
    						$$invalidate(1, title = data.payload[0].title);
    						$$invalidate(2, text = data.payload[0].text);
    						$$invalidate(3, answer = data.payload[0].answer);
    						return;
    					}

    					if (!hasInputChanged) {
    						$$invalidate(1, title = "");
    						$$invalidate(2, text = "");
    						$$invalidate(3, answer = "");
    					}
    				});
    			}
    		}
    	};

    	$$invalidate(4, users = []);

    	return [
    		selectedDay,
    		title,
    		text,
    		answer,
    		users,
    		days,
    		handleClick,
    		handleLogout,
    		handleSubmit,
    		handleChange,
    		hasInputChanged,
    		select_change_handler,
    		input0_input_handler,
    		textarea_input_handler,
    		input1_input_handler
    	];
    }

    class AdminPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AdminPanel",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    // (21:6) {:else}
    function create_else_block(ctx) {
    	let countdown;
    	let current;
    	countdown = new Countdown({ $$inline: true });
    	countdown.$on("start", once(/*start_handler*/ ctx[5]));

    	const block = {
    		c: function create() {
    			create_component(countdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(countdown, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(countdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(countdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(countdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(21:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:6) {#if adventHasStarted}
    function create_if_block_1(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });
    	login.$on("login", /*login_handler*/ ctx[3]);
    	login.$on("logout", /*logout_handler_1*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(19:6) {#if adventHasStarted}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if isAdmin}
    function create_if_block(ctx) {
    	let adminpanel;
    	let current;
    	adminpanel = new AdminPanel({ $$inline: true });
    	adminpanel.$on("logout", /*logout_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(adminpanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(adminpanel, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(adminpanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(adminpanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(adminpanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:4) {#if isAdmin}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t1;
    	let section;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let img;
    	let img_src_value;
    	let t3;
    	let button;
    	let a;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isAdmin*/ ctx[1]) return 0;
    		if (/*adventHasStarted*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "🎄 Hack Kosice 🎄";
    			t1 = space();
    			section = element("section");
    			if_block.c();
    			t2 = space();
    			img = element("img");
    			t3 = space();
    			button = element("button");
    			a = element("a");
    			a.textContent = "?";
    			add_location(h1, file, 12, 4, 415);
    			attr_dev(header, "class", "svelte-1a300jy");
    			add_location(header, file, 11, 2, 402);
    			attr_dev(section, "class", "svelte-1a300jy");
    			add_location(section, file, 14, 2, 470);
    			attr_dev(img, "alt", "Snow");
    			if (!src_url_equal(img.src, img_src_value = "images/SNEH.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-1a300jy");
    			add_location(img, file, 25, 2, 816);
    			attr_dev(a, "href", "mailto:dmatis@hackkosice.com?subject=HK%20Advent%20Feedback");
    			attr_dev(a, "class", "svelte-1a300jy");
    			add_location(a, file, 26, 51, 908);
    			attr_dev(button, "class", "feedback svelte-1a300jy");
    			attr_dev(button, "title", "Send a feedback");
    			add_location(button, file, 26, 2, 859);
    			attr_dev(main, "class", "svelte-1a300jy");
    			add_location(main, file, 10, 0, 393);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(main, t1);
    			append_dev(main, section);
    			if_blocks[current_block_type_index].m(section, null);
    			append_dev(main, t2);
    			append_dev(main, img);
    			append_dev(main, t3);
    			append_dev(main, button);
    			append_dev(button, a);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(section, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let isAdmin;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let adventHasStarted = true;
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const logout_handler = () => $$invalidate(1, isAdmin = false);
    	const login_handler = admin => $$invalidate(1, isAdmin = admin.detail.admin);
    	const logout_handler_1 = () => $$invalidate(1, isAdmin = false);
    	const start_handler = () => $$invalidate(0, adventHasStarted = true);

    	$$self.$capture_state = () => ({
    		Countdown,
    		Login,
    		AdminPanel,
    		parseJwt,
    		adventHasStarted,
    		isAdmin
    	});

    	$$self.$inject_state = $$props => {
    		if ('adventHasStarted' in $$props) $$invalidate(0, adventHasStarted = $$props.adventHasStarted);
    		if ('isAdmin' in $$props) $$invalidate(1, isAdmin = $$props.isAdmin);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, isAdmin = Object.keys(window.localStorage).includes('token')
    	? parseJwt(window.localStorage.getItem('token')).isAdmin
    	: false);

    	return [
    		adventHasStarted,
    		isAdmin,
    		logout_handler,
    		login_handler,
    		logout_handler_1,
    		start_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
